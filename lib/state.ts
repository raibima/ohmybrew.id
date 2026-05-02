import { createRedisState, type RedisStateAdapter } from "@chat-adapter/state-redis";
import { getStateConfig } from "@/lib/config";

let stateAdapter: RedisStateAdapter | undefined;

/**
 * Shared Redis-backed Chat SDK state adapter.
 *
 * Reusing a singleton keeps bot runtime state and custom memory on the same
 * connection/prefix instead of creating competing Redis clients.
 */
export function getStateAdapter(): RedisStateAdapter {
	if (!stateAdapter) {
		const config = getStateConfig();
		stateAdapter = createRedisState({ url: config.redisUrl });
	}

	return stateAdapter;
}
