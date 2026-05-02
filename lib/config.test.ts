import { getAiConfig, getStateConfig, getTelegramConfig } from "@/lib/config";

const ORIGINAL_ENV = process.env;

describe("runtime config", () => {
	beforeEach(() => {
		process.env = { ...ORIGINAL_ENV };
		delete process.env.TELEGRAM_BOT_TOKEN;
		delete process.env.TELEGRAM_WEBHOOK_SECRET_TOKEN;
		delete process.env.TELEGRAM_BOT_USERNAME;
		delete process.env.REDIS_URL;
		delete process.env.OPENAI_API_KEY;
		delete process.env.AI_CHAT_MODEL;
		delete process.env.AI_MEMORY_MODEL;
	});

	afterAll(() => {
		process.env = ORIGINAL_ENV;
	});

	it("validates required Telegram config and applies the username default", () => {
		process.env.NODE_ENV = "development";
		process.env.TELEGRAM_BOT_TOKEN = " telegram-token ";

		expect(getTelegramConfig()).toEqual({
			botToken: "telegram-token",
			botUsername: "ohmybrew_bot",
			webhookSecretToken: undefined,
		});
	});

	it("requires the Telegram webhook secret token in production", () => {
		process.env.NODE_ENV = "production";
		process.env.TELEGRAM_BOT_TOKEN = "telegram-token";

		expect(() => getTelegramConfig()).toThrow(
			"Missing required environment variable TELEGRAM_WEBHOOK_SECRET_TOKEN in production.",
		);
	});

	it("validates Redis config", () => {
		expect(() => getStateConfig()).toThrow(
			"Missing required environment variable REDIS_URL.",
		);

		process.env.REDIS_URL = " redis://localhost:6379 ";
		expect(getStateConfig()).toEqual({ redisUrl: "redis://localhost:6379" });
	});

	it("validates OpenAI config and applies model defaults", () => {
		expect(() => getAiConfig()).toThrow(
			"Missing required environment variable OPENAI_API_KEY.",
		);

		process.env.OPENAI_API_KEY = " openai-key ";
		expect(getAiConfig()).toEqual({
			apiKey: "openai-key",
			chatModel: "gpt-5.4-mini",
			memoryModel: "gpt-5.4-mini",
		});
	});
});
