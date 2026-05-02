const DEFAULT_TELEGRAM_BOT_USERNAME = "ohmybrew_bot";
const DEFAULT_AI_CHAT_MODEL = "gpt-5.4-mini";
const DEFAULT_AI_MEMORY_MODEL = "gpt-5.4-mini";

export interface TelegramConfig {
	botToken: string;
	botUsername: string;
	webhookSecretToken?: string;
}

export interface AiConfig {
	apiKey: string;
	chatModel: string;
	memoryModel: string;
}

export interface StateConfig {
	redisUrl: string;
}

export function getTelegramConfig(): TelegramConfig {
	return {
		botToken: readRequiredEnv("TELEGRAM_BOT_TOKEN"),
		botUsername:
			readOptionalEnv("TELEGRAM_BOT_USERNAME") ?? DEFAULT_TELEGRAM_BOT_USERNAME,
		webhookSecretToken: readWebhookSecretToken(),
	};
}

export function getAiConfig(): AiConfig {
	return {
		apiKey: readRequiredEnv("OPENAI_API_KEY"),
		chatModel: readOptionalEnv("AI_CHAT_MODEL") ?? DEFAULT_AI_CHAT_MODEL,
		memoryModel: readOptionalEnv("AI_MEMORY_MODEL") ?? DEFAULT_AI_MEMORY_MODEL,
	};
}

export function getStateConfig(): StateConfig {
	return {
		redisUrl: readRequiredEnv("REDIS_URL"),
	};
}

function readWebhookSecretToken(): string | undefined {
	const secretToken = readOptionalEnv("TELEGRAM_WEBHOOK_SECRET_TOKEN");
	if (secretToken) return secretToken;

	if (process.env.NODE_ENV === "production") {
		throw new Error(
			"Missing required environment variable TELEGRAM_WEBHOOK_SECRET_TOKEN in production. Configure it to verify Telegram webhook requests.",
		);
	}

	return undefined;
}

function readRequiredEnv(name: string): string {
	const value = readOptionalEnv(name);
	if (!value) {
		throw new Error(`Missing required environment variable ${name}.`);
	}

	return value;
}

function readOptionalEnv(name: string): string | undefined {
	const value = process.env[name]?.trim();
	return value ? value : undefined;
}
