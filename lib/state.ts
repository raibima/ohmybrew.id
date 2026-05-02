import { createRedisState, type RedisStateAdapter } from "@chat-adapter/state-redis";
import { getStateConfig, type StateConfig } from "@/lib/config";

let stateAdapter: RedisStateAdapter | undefined;

export function createStateAdapter(config: StateConfig): RedisStateAdapter {
	return createRedisState({ url: config.redisUrl });
}

/**
 * Shared Redis-backed Chat SDK state adapter.
 *
 * Reusing a singleton keeps bot runtime state and custom memory on the same
 * connection/prefix instead of creating competing Redis clients.
 */
export function getStateAdapter(): RedisStateAdapter {
	if (!stateAdapter) {
		stateAdapter = createStateAdapter(getStateConfig());
	}

	return stateAdapter;
}
