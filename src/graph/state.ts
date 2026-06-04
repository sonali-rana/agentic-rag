import { Annotation } from "@langchain/langgraph";

export const AgentState = Annotation.Root({
	question: Annotation<string>(),
	rewritten_question: Annotation<string>(),
	documents: Annotation<any[]>(),
	generation: Annotation<string>(),
	relevance: Annotation<string>(),
	retry_count: Annotation<number>(),
});
