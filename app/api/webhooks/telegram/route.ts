import { getBot } from "@/lib/bot";

// Webhook from Telegram → Chat SDK adapter.
// Configure via:
//   curl -X POST "https://api.telegram.org/bot$TELEGRAM_BOT_TOKEN/setWebhook" \
//     -H "Content-Type: application/json" \
//     -d '{
//       "url": "https://ohmybrew.id/api/webhooks/telegram",
//       "secret_token": "'"$TELEGRAM_WEBHOOK_SECRET_TOKEN"'"
//     }'

export const runtime = "nodejs";
export const dynamic = "force-dynamic";
export const maxDuration = 60;

export async function POST(request: Request): Promise<Response> {
	return getBot().webhooks.telegram(request);
}
