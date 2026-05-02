import { createRedisState, type RedisStateAdapter } from "@chat-adapter/state-redis";

let stateAdapter: RedisStateAdapter | undefined;

/**
 * Shared Redis-backed Chat SDK state adapter.
 *
 * Reusing a singleton keeps bot runtime state and custom memory on the same
 * connection/prefix instead of creating competing Redis clients.
 */
export function getStateAdapter(): RedisStateAdapter {
	if (!stateAdapter) {
		stateAdapter = createRedisState();
	}

	return stateAdapter;
}
