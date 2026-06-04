import { ChatPromptTemplate } from "@langchain/core/prompts";
import { StringOutputParser } from "@langchain/core/output_parsers";

import { groq } from "../config/index.js";
import { AgentState } from "../graph/state.js";

const parser = new StringOutputParser();

export const rewriteQuery = async (state: typeof AgentState.State) => {
	const prompt = ChatPromptTemplate.fromTemplate(`
You are a query rewriting system for RAG retrieval.

Rewrite the query to improve semantic retrieval.

RULES:
- Return ONLY the rewritten query
- No explanations
- No markdown
- Keep under 1 sentence

Question:
{question}
`);

	const chain = prompt.pipe(groq).pipe(parser);

	const rewrittenQuery = await chain.invoke({
		question: state.question,
	});

	console.log("Query rewritten successfully");

	return {
		rewritten_question: rewrittenQuery,
	};
};
