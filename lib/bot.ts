import { Chat } from "chat";
import { createTelegramAdapter } from "@chat-adapter/telegram";
import { getAgent } from "@/lib/agent";
import {
	buildMemoryMessages,
	loadSessionMemory,
	updateSessionMemory,
} from "@/lib/memory";
import { maybeHandleMemoryDebugCommand } from "@/lib/memory-debug";
import { getStateAdapter } from "@/lib/state";

/**
 * Oh My Brew Telegram bot.
 *
 * Reads config from env:
 * - TELEGRAM_BOT_TOKEN            (required)
 * - TELEGRAM_WEBHOOK_SECRET_TOKEN (recommended — verifies Telegram webhook calls)
 * - TELEGRAM_BOT_USERNAME         (optional, auto-detected via getMe)
 * - REDIS_URL                     (required in production for state/dedupe/locks)
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
	const userName = process.env.TELEGRAM_BOT_USERNAME ?? "ohmybrew_bot";

	return new Chat({
		userName,
		adapters: {
			telegram: createTelegramAdapter({
				// On Vercel this resolves to "webhook"; locally it falls back to polling.
				mode: "auto",
			}),
		},
		state: getStateAdapter(),
		dedupeTtlMs: DEDUPE_TTL_MS,
	});
}

function registerHandlers(bot: Bot): void {
	bot.onDirectMessage(async (thread, message) => {
		const text = message.text?.trim();
		if (!text) return;

		try {
			const debugResponse = await maybeHandleMemoryDebugCommand(message, text);
			if (debugResponse) {
				await thread.post(debugResponse);
				return;
			}

			await thread.startTyping();
			const memory = await loadSessionMemory(message);
			const result = await getAgent().stream({
				messages: buildMemoryMessages(memory, text),
			});

			let assistantText = "";
			async function* collectTextStream(): AsyncIterable<string> {
				for await (const delta of result.textStream) {
					assistantText += delta;
					yield delta;
				}
			}

			await thread.post(collectTextStream());

			if (assistantText.trim()) {
				await updateSessionMemory({
					assistantText: assistantText.trim(),
					memory,
					userText: text,
				});
			}
		} catch (err) {
			console.error("[bot] AI reply failed", err);
			await thread.post(
				"Duh, otakku lagi macet kayak mesin espresso dingin ☕️ — coba lagi sebentar ya.",
			);
		}
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
