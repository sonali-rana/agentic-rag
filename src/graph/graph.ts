import { StateGraph, START, END } from "@langchain/langgraph";

import { AgentState } from "./state.js";

import { rewriteQuery } from "../agents/rewrite.js";
import { retrieveDocs } from "../agents/retrieve.js";
import { gradeDocuments } from "../agents/grade.js";
import { generateAnswer } from "../agents/generate.js";

export const buildGraph = (retriever: any) => {
	const retrieve = retrieveDocs(retriever);

	const retryTracker = (state: typeof AgentState.State) => ({
		retry_count: state.retry_count + 1,
	});

	const decide = (state: typeof AgentState.State) => {
		if (state.relevance === "relevant") {
			return "generate";
		}

		if (state.retry_count >= 2) {
			return "generate";
		}

		return "rewrite";
	};

	const builder = new StateGraph(AgentState);

	builder.addNode("rewrite", rewriteQuery);

	builder.addNode("retrieve", retrieve);

	builder.addNode("grade", gradeDocuments);

	builder.addNode("generate", generateAnswer);

	builder.addNode("retry", retryTracker);

	builder.addEdge(START as any, "rewrite" as any);

	builder.addEdge("rewrite" as any, "retrieve" as any);

	builder.addEdge("retrieve" as any, "grade" as any);

	builder.addConditionalEdges(
		"grade" as any,
		decide as any,
		{
			rewrite: "retry",
			generate: "generate",
		} as any,
	);

	builder.addEdge("retry" as any, "rewrite" as any);

	builder.addEdge("generate" as any, END as any);

	return builder.compile();
};
