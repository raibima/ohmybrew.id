import { Chat, type Message, type Thread } from "chat";
import { createTelegramAdapter } from "@chat-adapter/telegram";
import { getAgent } from "@/lib/agent";
import { getTelegramConfig } from "@/lib/config";
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

type Bot = Chat<{ telegram: ReturnType<typeof createTelegramAdapter> }>;

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

	const instance = createBot();
	registerHandlers(instance);
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

function createBot(): Bot {
	const telegramConfig = getTelegramConfig();

	return new Chat({
		userName: telegramConfig.botUsername,
		adapters: {
			telegram: createTelegramAdapter({
				botToken: telegramConfig.botToken,
				// On Vercel this resolves to "webhook"; locally it falls back to polling.
				mode: "auto",
				secretToken: telegramConfig.webhookSecretToken,
				userName: telegramConfig.botUsername,
			}),
		},
		state: getStateAdapter(),
		dedupeTtlMs: DEDUPE_TTL_MS,
	});
}

function registerHandlers(bot: Bot): void {
	bot.onDirectMessage(handleDirectMessage);
}

async function handleDirectMessage(thread: Thread, message: Message): Promise<void> {
	const text = parseDirectMessageText(message);
	if (!text) return;

	try {
		if (await handleMemoryDebugCommand(thread, message, text)) return;
		await replyWithAgent(thread, message, text);
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
): Promise<boolean> {
	const debugResponse = await maybeHandleMemoryDebugCommand(message, text);
	if (!debugResponse) return false;

	await thread.post(debugResponse);
	return true;
}

async function replyWithAgent(
	thread: Thread,
	message: Message,
	userText: string,
): Promise<void> {
	await thread.startTyping();

	const memory = await loadSessionMemory(message);
	const result = await getAgent().stream({
		messages: buildMemoryMessages(memory, userText),
	});
	const assistantText = await streamAndCollectText(thread, result.textStream);

	await persistConversationTurn({ assistantText, memory, userText });
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

async function persistConversationTurn({
	assistantText,
	memory,
	userText,
}: {
	assistantText: string;
	memory: SessionMemory;
	userText: string;
}): Promise<void> {
	if (!assistantText) return;

	await updateSessionMemory({
		assistantText,
		memory,
		userText,
	});
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
