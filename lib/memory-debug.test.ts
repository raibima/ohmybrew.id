import type { Message } from "chat";

jest.mock("@/lib/memory", () => ({
	deleteSessionMemory: jest.fn(),
	formatMemoryDebugDump: jest.fn(),
	formatMemoryDebugReport: jest.fn(),
	formatMemoryPromptDebug: jest.fn(),
	loadSessionMemory: jest.fn(),
}));

import { maybeHandleMemoryDebugCommand } from "@/lib/memory-debug";

const ORIGINAL_ENV = process.env;

function createMessage(authorId = "telegram-user-123"): Message {
	return {
		author: {
			userId: authorId,
		},
	} as unknown as Message;
}

describe("memory debug commands", () => {
	beforeEach(() => {
		process.env = { ...ORIGINAL_ENV };
		delete process.env.TELEGRAM_MEMORY_DEBUG;
		delete process.env.TELEGRAM_MEMORY_DEBUG_USER_IDS;
	});

	afterAll(() => {
		process.env = ORIGINAL_ENV;
	});

	it("keeps /debug_memory_id local-development only", async () => {
		process.env.NODE_ENV = "production";

		await expect(
			maybeHandleMemoryDebugCommand(createMessage(), "/debug_memory_id"),
		).resolves.toBe("Memory debug commands are only available in local development.");
	});

	it("allows /debug_memory_id in local development without enabling full debug commands", async () => {
		process.env.NODE_ENV = "development";

		await expect(
			maybeHandleMemoryDebugCommand(createMessage(), "/debug_memory_id"),
		).resolves.toContain("TELEGRAM_MEMORY_DEBUG_USER_IDS=telegram-user-123");
	});
});
