import { ChatPromptTemplate } from "@langchain/core/prompts";
import { StringOutputParser } from "@langchain/core/output_parsers";

import { groq } from "../config/index.js";
import { AgentState } from "../graph/state.js";

const parser = new StringOutputParser();

export const gradeDocuments = async (state: typeof AgentState.State) => {
	const question = state.rewritten_question || state.question;

	const docs = state.documents || [];

	const context = docs.map((doc) => doc.pageContent).join("\n\n");

	const prompt = ChatPromptTemplate.fromTemplate(`
You are a strict relevance evaluator.

Determine whether the retrieved context
is sufficient to answer the question.

Question:
{question}

Context:
{context}

Respond ONLY with:
relevant

OR

not relevant
`);

	const chain = prompt.pipe(groq).pipe(parser);

	const result = await chain.invoke({
		question,
		context,
	});

	console.log(`Retrieval relevance: ${result}`);

	return {
		relevance: result.trim().toLowerCase(),
	};
};
