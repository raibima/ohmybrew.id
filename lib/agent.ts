import { ToolLoopAgent } from "ai";
import { openai } from "@ai-sdk/openai";
import { BRAND_SYSTEM_PROMPT } from "@/lib/prompts/brand";

/**
 * Singleton AI agent. Reads OPENAI_API_KEY from env (used implicitly by
 * the `@ai-sdk/openai` provider).
 */
let agent: ToolLoopAgent | undefined;

export function getAgent(): ToolLoopAgent {
	if (agent) return agent;

	agent = new ToolLoopAgent({
		model: openai("gpt-5.4-mini"),
		instructions: BRAND_SYSTEM_PROMPT,
	});

	return agent;
}
