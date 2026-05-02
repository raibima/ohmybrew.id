import { ToolLoopAgent } from "ai";
import { createOpenAI } from "@ai-sdk/openai";
import { getAiConfig, type AiConfig } from "@/lib/config";
import { BRAND_SYSTEM_PROMPT } from "@/lib/prompts/brand";

/**
 * Singleton AI agent built from validated runtime config.
 */
let agent: ToolLoopAgent | undefined;

export function createAgent(config: AiConfig): ToolLoopAgent {
	const openai = createOpenAI({ apiKey: config.apiKey });

	return new ToolLoopAgent({
		model: openai(config.chatModel),
		instructions: BRAND_SYSTEM_PROMPT,
	});
}

export function getAgent(): ToolLoopAgent {
	if (!agent) {
		agent = createAgent(getAiConfig());
	}

	return agent;
}
