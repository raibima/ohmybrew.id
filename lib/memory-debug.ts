import type { Message } from "chat";
import {
	deleteSessionMemory,
	formatMemoryDebugDump,
	formatMemoryDebugReport,
	formatMemoryPromptDebug,
	loadSessionMemory,
} from "@/lib/memory";

const DEBUG_COMMANDS = new Set([
	"/debug_memory",
	"/debug_memory_raw",
	"/debug_memory_clear",
	"/debug_memory_help",
	"/debug_memory_id",
	"/debug_memory_prompt",
]);

const MAX_TELEGRAM_DEBUG_LENGTH = 3_800;

export async function maybeHandleMemoryDebugCommand(
	message: Message,
	text: string,
): Promise<string | null> {
	const { command, rest } = parseCommand(text);
	if (!command) return null;

	if (command === "/debug_memory_id") {
		return [
			"Your Telegram debug author ID:",
			message.author.userId,
			"",
			"Enable memory debug locally with TELEGRAM_MEMORY_DEBUG=1.",
			"Optionally restrict it with TELEGRAM_MEMORY_DEBUG_USER_IDS=" + message.author.userId,
		].join("\n");
	}

	if (!DEBUG_COMMANDS.has(command)) return null;

	const gate = getDebugGate(message);
	if (!gate.allowed) return gate.message;

	if (command === "/debug_memory_help") return getHelpText(message.author.userId);

	if (command === "/debug_memory_clear") {
		await deleteSessionMemory(message);
		return "Memory for this DM thread was cleared. Fresh cup, clean slate ☕️";
	}

	const memory = await loadSessionMemory(message);

	if (command === "/debug_memory_raw") {
		return codeBlock(truncateDebugText(formatMemoryDebugDump(memory)));
	}

	if (command === "/debug_memory") {
		return truncateDebugText(formatMemoryDebugReport(memory));
	}

	if (command === "/debug_memory_prompt") {
		const promptText = rest || "(debug placeholder user message)";
		return codeBlock(truncateDebugText(formatMemoryPromptDebug(memory, promptText)));
	}

	return null;
}

function parseCommand(text: string): { command: string | null; rest: string } {
	const trimmed = text.trim();
	const [rawCommand = "", ...restParts] = trimmed.split(/\s+/);
	const command = rawCommand.toLowerCase();

	if (command === "/debug_memory_prompt") {
		return { command, rest: restParts.join(" ").trim() };
	}

	if (DEBUG_COMMANDS.has(command)) return { command, rest: restParts.join(" ").trim() };
	return { command: null, rest: "" };
}

function getDebugGate(message: Message): { allowed: true } | { allowed: false; message: string } {
	if (process.env.NODE_ENV !== "development") {
		return {
			allowed: false,
			message: "Memory debug commands are only available in local development.",
		};
	}

	if (process.env.TELEGRAM_MEMORY_DEBUG !== "1") {
		return {
			allowed: false,
			message: [
				"Memory debug is disabled.",
				"Set TELEGRAM_MEMORY_DEBUG=1 in local dev to enable it.",
				`Your author ID: ${message.author.userId}`,
			].join("\n"),
		};
	}

	const allowedIds = parseAllowedIds(process.env.TELEGRAM_MEMORY_DEBUG_USER_IDS);
	if (allowedIds.length > 0 && !allowedIds.includes(message.author.userId)) {
		return {
			allowed: false,
			message: `Memory debug is enabled, but your author ID (${message.author.userId}) is not allowlisted.`,
		};
	}

	return { allowed: true };
}

function parseAllowedIds(value: string | undefined): string[] {
	return (value ?? "")
		.split(",")
		.map((id) => id.trim())
		.filter(Boolean);
}

function getHelpText(authorId: string): string {
	return [
		"🧠 Memory debug commands (local dev only)",
		"/debug_memory — summary, key, facts, and latest turn",
		"/debug_memory_raw — full stored JSON for this DM thread",
		"/debug_memory_prompt <text> — prompt messages that would be sent to the agent",
		"/debug_memory_clear — delete memory for this DM thread",
		"/debug_memory_id — show your Telegram author ID",
		"",
		`Current author ID: ${authorId}`,
	].join("\n");
}

function codeBlock(value: string): string {
	return "```json\n" + value.replace(/```/g, "`​`​`") + "\n```";
}

function truncateDebugText(value: string): string {
	if (value.length <= MAX_TELEGRAM_DEBUG_LENGTH) return value;
	return value.slice(0, MAX_TELEGRAM_DEBUG_LENGTH - 80).trimEnd() + "\n…(truncated for Telegram)";
}
