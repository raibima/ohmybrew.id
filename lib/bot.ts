import { Chat } from "chat";
import { createTelegramAdapter } from "@chat-adapter/telegram";
import { createRedisState } from "@chat-adapter/state-redis";

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

let _bot: Bot | undefined;

export function getBot(): Bot {
	if (_bot) return _bot;

	const botUserName = process.env.TELEGRAM_BOT_USERNAME ?? "ohmybrew_bot";

	const instance = new Chat({
		userName: botUserName,
		adapters: {
			telegram: createTelegramAdapter({
				// On Vercel this resolves to "webhook"; locally it falls back to polling.
				mode: "auto",
			}),
		},
		state: createRedisState(),
		// Telegram retries webhooks aggressively on non-2xx responses; dedupe for 10 min.
		dedupeTtlMs: 10 * 60 * 1000,
	});

	registerHandlers(instance);

	// In long-running runtimes (local dev) this kicks off polling.
	// On Vercel serverless this is effectively a no-op for webhook mode.
	void instance.initialize();

	_bot = instance;
	return instance;
}

// --- Handlers -----------------------------------------------------------

function registerHandlers(bot: Bot): void {
	bot.onDirectMessage(async (thread) => {
		await thread.subscribe();
		await thread.post(
			`Halo! Selamat datang di Oh My Brew ☕\n\n` +
				`Kamu bisa pesan via GrabFood / GoFood. ` +
				`Kirim "menu" untuk melihat menu kami.`,
		);
	});

	bot.onNewMention(async (thread, message) => {
		await thread.subscribe();
		await thread.post(`Hai! Ada yang bisa kami bantu? (you said: ${message.text})`);
	});

	bot.onSubscribedMessage(async (thread, message) => {
		const text = (message.text ?? "").trim().toLowerCase();
		if (!text) return;

		if (text === "menu" || text === "/menu") {
			await thread.post(
				[
					"*Menu Oh My Brew*",
					"",
					"_Signature White_",
					"• Creamy Latte — Rp 18.900",
					"• Strong Latte — Rp 18.900",
					"• Mint Latte — Rp 18.900",
					"• Maple Latte — Rp 18.900",
					"",
					"_Signature Black_",
					"• Iced Americano — Rp 46.000",
					"• Iced Espresso Tonic — Rp 52.000",
					"• Iced Yuzu Americano — Rp 52.000",
					"",
					"_Specialty Classic_",
					"• Hot Long Black / Americano — Rp 24.900",
					"• Flat White / Cappuccino — Rp 28.900",
					"• Magic — Rp 50.000",
					"• Mocha — Rp 31.000",
					"",
					"Pesan via GrabFood atau GoFood ya ☕",
				].join("\n"),
			);
			return;
		}

		if (text === "/start" || text === "start" || text === "halo" || text === "hi") {
			await thread.post(
				`Halo! Aku bot Oh My Brew. Ketik *menu* untuk melihat menu kami.`,
			);
		}
	});
}
