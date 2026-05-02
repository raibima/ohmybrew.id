import { generateText, jsonSchema, Output, type ModelMessage } from "ai";
import { createOpenAI } from "@ai-sdk/openai";
import type { Message } from "chat";
import { getAiConfig } from "@/lib/config";
import { getStateAdapter } from "@/lib/state";

const MEMORY_KEY_PREFIX = "memory:dm";
const MAX_RECENT_TURNS = 20;
const MAX_FACTS = 24;
const MAX_FACT_LENGTH = 180;
const MAX_SUMMARY_LENGTH = 1_200;

export interface MemoryTurn {
	assistant: string;
	at: string;
	user: string;
}

export interface SessionMemory {
	facts: string[];
	recentTurns: MemoryTurn[];
	stableSummary: string;
	threadId: string;
	updatedAt: string;
}

interface MemoryUpdate {
	facts: string[];
	stableSummary: string;
}

const memoryUpdateSchema = jsonSchema<MemoryUpdate>(
	{
		type: "object",
		properties: {
			stableSummary: {
				type: "string",
				maxLength: MAX_SUMMARY_LENGTH,
				description: "Concise stable summary of useful long-term context.",
			},
			facts: {
				type: "array",
				maxItems: MAX_FACTS,
				items: {
					type: "string",
					maxLength: MAX_FACT_LENGTH,
				},
				description: "Short durable user facts, preferences, and recurring needs.",
			},
		},
		required: ["stableSummary", "facts"],
		additionalProperties: false,
	},
	{
		validate(value) {
			if (!isMemoryUpdate(value)) {
				return {
					success: false,
					error: new Error("Invalid memory update shape"),
				};
			}

			return { success: true, value };
		},
	},
);

export function getMemoryKey(message: Message): string {
	return getMemoryKeyFromThreadId(message.threadId);
}

export function getMemoryKeyFromThreadId(threadId: string): string {
	return `${MEMORY_KEY_PREFIX}:${threadId}`;
}

export async function loadSessionMemory(message: Message): Promise<SessionMemory> {
	const key = getMemoryKey(message);
	const stored = await getStateAdapter().get<Partial<SessionMemory>>(key);

	return normalizeMemory(stored, message.threadId);
}

export function buildMemoryMessages(
	memory: SessionMemory,
	currentUserText: string,
): ModelMessage[] {
	const messages: ModelMessage[] = [];
	const context = formatMemoryContext(memory);

	if (context) {
		messages.push({
			role: "user",
			content: [
				"Konteks memori untuk sesi DM ini:",
				context,
				"Gunakan hanya kalau relevan. Jangan menyebut bahwa kamu menyimpan memori kecuali user bertanya langsung.",
			].join("\n"),
		});
	}

	for (const turn of memory.recentTurns.slice(-MAX_RECENT_TURNS)) {
		messages.push({ role: "user", content: turn.user });
		messages.push({ role: "assistant", content: turn.assistant });
	}

	messages.push({ role: "user", content: currentUserText });

	return messages;
}

export async function updateSessionMemory({
	assistantText,
	memory,
	userText,
}: {
	assistantText: string;
	memory: SessionMemory;
	userText: string;
}): Promise<void> {
	const nextMemory: SessionMemory = {
		...memory,
		recentTurns: [
			...memory.recentTurns,
			{
				assistant: assistantText,
				at: new Date().toISOString(),
				user: userText,
			},
		].slice(-MAX_RECENT_TURNS),
		updatedAt: new Date().toISOString(),
	};

	try {
		const config = getAiConfig();
		const openai = createOpenAI({ apiKey: config.apiKey });
		const extraction = await generateText({
			model: openai(config.memoryModel),
			output: Output.object({
				schema: memoryUpdateSchema,
				name: "memory_update",
				description: "Updated long-term memory for a DM-only Telegram coffee-shop bot.",
			}),
			system: [
				"You update long-term memory for a DM-only Telegram coffee-shop bot.",
				"Keep useful user preferences, stable personal facts, recurring ordering needs, and important business context.",
				"Do not store secrets, payment details, one-time delivery codes, or sensitive personal data.",
				`Keep stableSummary under ${MAX_SUMMARY_LENGTH} characters and facts under ${MAX_FACTS} short strings.`,
			].join(" "),
			prompt: JSON.stringify({
				currentMemory: {
					facts: nextMemory.facts,
					stableSummary: nextMemory.stableSummary,
				},
				latestExchange: {
					assistant: assistantText,
					user: userText,
				},
			}),
		});

		const parsed = extraction.output;
		nextMemory.facts = normalizeFacts(parsed.facts, nextMemory.facts);
		nextMemory.stableSummary = normalizeSummary(
			parsed.stableSummary,
			nextMemory.stableSummary,
		);
	} catch (err) {
		console.warn("[memory] stable memory update failed; saving recent turn only", err);
	}

	await saveSessionMemory(nextMemory);
}

export async function deleteSessionMemory(message: Message): Promise<void> {
	await getStateAdapter().delete(getMemoryKey(message));
}

export function formatMemoryDebugDump(memory: SessionMemory): string {
	return JSON.stringify(memory, null, 2);
}

export function formatMemoryDebugReport(memory: SessionMemory): string {
	const latestTurn = memory.recentTurns.at(-1);
	const sections = [
		"🧠 Memory debug",
		`key: ${getMemoryKeyFromThreadId(memory.threadId)}`,
		`threadId: ${memory.threadId}`,
		`updatedAt: ${memory.updatedAt}`,
		`stableSummary: ${memory.stableSummary || "(empty)"}`,
		memory.facts.length > 0
			? `facts:\n${memory.facts.map((fact) => `- ${fact}`).join("\n")}`
			: "facts: (empty)",
		`recentTurns: ${memory.recentTurns.length}`,
	];

	if (latestTurn) {
		sections.push(
			[
				"latestTurn:",
				`user: ${truncate(latestTurn.user, 240)}`,
				`assistant: ${truncate(latestTurn.assistant, 240)}`,
			].join("\n"),
		);
	}

	return sections.join("\n\n");
}

export function formatMemoryPromptDebug(
	memory: SessionMemory,
	currentUserText: string,
): string {
	return JSON.stringify(buildMemoryMessages(memory, currentUserText), null, 2);
}

async function saveSessionMemory(memory: SessionMemory): Promise<void> {
	await getStateAdapter().set(getMemoryKeyFromThreadId(memory.threadId), memory);
}

function normalizeMemory(
	stored: Partial<SessionMemory> | null,
	threadId: string,
): SessionMemory {
	return {
		facts: normalizeFacts(stored?.facts, []),
		recentTurns: normalizeTurns(stored?.recentTurns),
		stableSummary: normalizeSummary(stored?.stableSummary, ""),
		threadId,
		updatedAt:
			typeof stored?.updatedAt === "string"
				? stored.updatedAt
				: new Date().toISOString(),
	};
}

function normalizeTurns(turns: unknown): MemoryTurn[] {
	if (!Array.isArray(turns)) return [];

	return turns
		.filter((turn): turn is Partial<MemoryTurn> => Boolean(turn))
		.map((turn) => ({
			assistant: typeof turn.assistant === "string" ? turn.assistant : "",
			at: typeof turn.at === "string" ? turn.at : new Date().toISOString(),
			user: typeof turn.user === "string" ? turn.user : "",
		}))
		.filter((turn) => turn.user || turn.assistant)
		.slice(-MAX_RECENT_TURNS);
}

function normalizeFacts(value: unknown, fallback: string[]): string[] {
	if (!Array.isArray(value)) return fallback.slice(0, MAX_FACTS);

	const facts = value
		.filter((fact): fact is string => typeof fact === "string")
		.map((fact) => fact.trim())
		.filter(Boolean)
		.map((fact) => truncate(fact, MAX_FACT_LENGTH));

	return Array.from(new Set(facts)).slice(0, MAX_FACTS);
}

function normalizeSummary(value: unknown, fallback: string): string {
	if (typeof value !== "string") return truncate(fallback.trim(), MAX_SUMMARY_LENGTH);
	return truncate(value.trim(), MAX_SUMMARY_LENGTH);
}

function isMemoryUpdate(value: unknown): value is MemoryUpdate {
	return (
		typeof value === "object" &&
		value !== null &&
		Array.isArray((value as MemoryUpdate).facts) &&
		(value as MemoryUpdate).facts.every((fact) => typeof fact === "string") &&
		typeof (value as MemoryUpdate).stableSummary === "string"
	);
}

function formatMemoryContext(memory: SessionMemory): string {
	const sections: string[] = [];

	if (memory.stableSummary) {
		sections.push(`Ringkasan stabil: ${memory.stableSummary}`);
	}

	if (memory.facts.length > 0) {
		sections.push(`Fakta/preferensi:\n${memory.facts.map((fact) => `- ${fact}`).join("\n")}`);
	}

	return sections.join("\n\n");
}

function truncate(value: string, maxLength: number): string {
	if (value.length <= maxLength) return value;
	return value.slice(0, maxLength - 1).trimEnd() + "…";
}
