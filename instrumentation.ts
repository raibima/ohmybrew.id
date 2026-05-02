/**
 * Next.js instrumentation hook.
 * Runs once per server start (before any request).
 *
 * In local dev we eagerly initialize the Telegram bot so polling kicks off
 * immediately — no need to curl /api/webhooks/telegram to "wake" it up.
 *
 * In production (Vercel serverless) we skip this: webhook invocations handle
 * cold-start init lazily via getBot(), and we don't want to spin up extra
 * work on every cold lambda.
 */
export async function register(): Promise<void> {
	if (process.env.NEXT_RUNTIME !== "nodejs") return;
	if (process.env.NODE_ENV !== "development") return;

	const { getBot } = await import("@/lib/bot");
	getBot();
}
