import { ToolLoopAgent } from "ai";
import { createOpenAI } from "@ai-sdk/openai";
import { getAiConfig } from "@/lib/config";
import { BRAND_SYSTEM_PROMPT } from "@/lib/prompts/brand";

/**
 * Singleton AI agent built from validated runtime config.
 */
let agent: ToolLoopAgent | undefined;

export function getAgent(): ToolLoopAgent {
	if (agent) return agent;

	const config = getAiConfig();
	const openai = createOpenAI({ apiKey: config.apiKey });

	agent = new ToolLoopAgent({
		model: openai(config.chatModel),
		instructions: BRAND_SYSTEM_PROMPT,
	});

	return agent;
}
