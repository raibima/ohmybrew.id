import { Chat, type Adapter, type Message, type StateAdapter, type Thread } from "chat";
import { createTelegramAdapter } from "@chat-adapter/telegram";
import type { Agent } from "ai";
import { getAgent } from "@/lib/agent";
import { getTelegramConfig, type TelegramConfig } from "@/lib/config";
import {
	buildMemoryMessages,
	loadSessionMemory,
	type SessionMemory,
	updateSessionMemory,
} from "@/lib/memory";
import { maybeHandleMemoryDebugCommand } from "@/lib/memory-debug";
import { getStateAdapter } from "@/lib/state";

/**
 * Oh My Brew Telegram bot.
 *
 * Reads validated runtime config via `lib/config.ts`.
 *
 * The bot is constructed lazily (singleton) to avoid the Telegram adapter
 * blowing up at Next.js build time when env vars aren't loaded yet (e.g.
 * during static page-data collection).
 */

type TelegramAdapter = Adapter;
type Bot = Chat<{ telegram: TelegramAdapter }>;
type BotAgent = Pick<Agent, "stream">;
type MemoryLoader = typeof loadSessionMemory;
type MemoryUpdater = typeof updateSessionMemory;
type MemoryDebugHandler = typeof maybeHandleMemoryDebugCommand;

export interface CreateBotDependencies {
	agent: BotAgent;
	debugCommandHandler: MemoryDebugHandler;
	memoryLoader: MemoryLoader;
	memoryUpdater: MemoryUpdater;
	state: StateAdapter;
	telegramAdapter: TelegramAdapter;
	telegramConfig: Pick<TelegramConfig, "botUsername">;
}

interface DirectMessageDependencies {
	agent: BotAgent;
	debugCommandHandler: MemoryDebugHandler;
	memoryLoader: MemoryLoader;
	memoryUpdater: MemoryUpdater;
}

// Telegram retries webhooks aggressively on non-2xx responses; dedupe for 10 min.
const DEDUPE_TTL_MS = 10 * 60 * 1000;

/**
 * In Next.js dev, HMR re-evaluates this module on every edit, which would
 * normally throw away the cached bot while the previous polling loop keeps
 * running in the background — leading to zombie pollers and stale handlers.
 * Caching on `globalThis` keeps a single source of truth across HMR reloads,
 * and the `import.meta.hot.dispose` hook below shuts the old instance down
 * cleanly before the replacement is constructed.
 */
declare global {
	var __ohmybrewBot: Bot | undefined;
}

// Minimal shape of the Vite/Turbopack-style HMR API we rely on.
interface ViteLikeHot {
	dispose(cb: () => void | Promise<void>): void;
	accept?: (cb?: () => void) => void;
}

export function getBot(): Bot {
	if (globalThis.__ohmybrewBot) return globalThis.__ohmybrewBot;

	const instance = createProductionBot();
	registerHmrCleanup(instance);

	// In long-running runtimes (local dev) this kicks off polling.
	// On Vercel serverless this is effectively a no-op for webhook mode.
	// If init fails, evict the cached singleton so the next call retries
	// instead of returning a permanently-broken instance.
	instance.initialize().catch((err) => {
		console.error("[bot] initialize failed", err);
		if (globalThis.__ohmybrewBot === instance) {
			globalThis.__ohmybrewBot = undefined;
		}
	});

	globalThis.__ohmybrewBot = instance;
	return instance;
}

function createProductionBot(): Bot {
	const telegramConfig = getTelegramConfig();

	return createBot({
		agent: getAgent(),
		debugCommandHandler: maybeHandleMemoryDebugCommand,
		memoryLoader: loadSessionMemory,
		memoryUpdater: updateSessionMemory,
		state: getStateAdapter(),
		telegramAdapter: createTelegramAdapter({
			botToken: telegramConfig.botToken,
			// On Vercel this resolves to "webhook"; locally it falls back to polling.
			mode: "auto",
			secretToken: telegramConfig.webhookSecretToken,
			userName: telegramConfig.botUsername,
		}),
		telegramConfig,
	});
}

export function createBot(dependencies: CreateBotDependencies): Bot {
	const bot = new Chat({
		userName: dependencies.telegramConfig.botUsername,
		adapters: {
			telegram: dependencies.telegramAdapter,
		},
		state: dependencies.state,
		dedupeTtlMs: DEDUPE_TTL_MS,
	});

	registerHandlers(bot, dependencies);
	return bot;
}

function registerHandlers(bot: Bot, dependencies: DirectMessageDependencies): void {
	bot.onDirectMessage((thread, message) =>
		handleDirectMessage(thread, message, dependencies),
	);
}

async function handleDirectMessage(
	thread: Thread,
	message: Message,
	dependencies: DirectMessageDependencies,
): Promise<void> {
	const text = parseDirectMessageText(message);
	if (!text) return;

	try {
		if (await handleMemoryDebugCommand(thread, message, text, dependencies)) return;
		await replyWithAgent(thread, message, text, dependencies);
	} catch (err) {
		console.error("[bot] AI reply failed", err);
		await thread.post(
			"Duh, otakku lagi macet kayak mesin espresso dingin ☕️ — coba lagi sebentar ya.",
		);
	}
}

function parseDirectMessageText(message: Message): string | null {
	const text = message.text?.trim();
	return text || null;
}

async function handleMemoryDebugCommand(
	thread: Thread,
	message: Message,
	text: string,
	dependencies: DirectMessageDependencies,
): Promise<boolean> {
	const debugResponse = await dependencies.debugCommandHandler(message, text);
	if (!debugResponse) return false;

	await thread.post(debugResponse);
	return true;
}

async function replyWithAgent(
	thread: Thread,
	message: Message,
	userText: string,
	dependencies: DirectMessageDependencies,
): Promise<void> {
	await thread.startTyping();

	const memory = await dependencies.memoryLoader(message);
	const result = await dependencies.agent.stream({
		messages: buildMemoryMessages(memory, userText),
	});
	const assistantText = await streamAndCollectText(thread, result.textStream);

	await persistConversationTurn({ assistantText, memory, userText }, dependencies);
}

async function streamAndCollectText(
	thread: Thread,
	textStream: AsyncIterable<string>,
): Promise<string> {
	let assistantText = "";

	async function* collectTextStream(): AsyncIterable<string> {
		for await (const delta of textStream) {
			assistantText += delta;
			yield delta;
		}
	}

	await thread.post(collectTextStream());
	return assistantText.trim();
}

async function persistConversationTurn(
	{
		assistantText,
		memory,
		userText,
	}: {
		assistantText: string;
		memory: SessionMemory;
		userText: string;
	},
	dependencies: DirectMessageDependencies,
): Promise<void> {
	if (!assistantText) return;

	try {
		await dependencies.memoryUpdater({
			assistantText,
			memory,
			userText,
		});
	} catch (err) {
		console.warn("[bot] memory persistence failed after successful reply", err);
	}
}

/**
 * Dev-only: tear down the previous instance when HMR replaces this module
 * so we don't leak polling loops or Redis locks.
 */
function registerHmrCleanup(instance: Bot): void {
	if (process.env.NODE_ENV !== "development") return;

	const hot = (import.meta as unknown as { hot?: ViteLikeHot }).hot;
	if (!hot) return;

	hot.dispose(async () => {
		try {
			await instance.shutdown();
		} catch (err) {
			console.warn("[bot] shutdown on HMR failed", err);
		}
		if (globalThis.__ohmybrewBot === instance) {
			globalThis.__ohmybrewBot = undefined;
		}
	});
	hot.accept?.();
}
