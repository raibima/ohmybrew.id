Oh My Brew website.

Yes, it's open source.

## Telegram bot memory

The DM-only Telegram bot stores per-DM-session memory in the existing Redis state backend (`REDIS_URL`). Memory has no TTL and is scoped by Telegram DM thread ID. It keeps a compact stable summary/fact list plus a bounded recent-turn window for prompt context.

### Local memory debugging

In local development, enable Telegram memory debug commands with `TELEGRAM_MEMORY_DEBUG=1`. Optionally restrict access with `TELEGRAM_MEMORY_DEBUG_USER_IDS=123,456`.

Commands:
- `/debug_memory_id` — show your Telegram author ID
- `/debug_memory` — show the memory key, stable summary, facts, and latest turn
- `/debug_memory_raw` — dump stored JSON for the current DM thread
- `/debug_memory_prompt <text>` — preview the agent message array with memory injected
- `/debug_memory_clear` — clear memory for the current DM thread
