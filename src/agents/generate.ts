import { ChatPromptTemplate } from "@langchain/core/prompts";
import { StringOutputParser } from "@langchain/core/output_parsers";

import { groq } from "../config/index.js";
import { AgentState } from "../graph/state.js";

const parser = new StringOutputParser();

export const generateAnswer = async (state: typeof AgentState.State) => {
	const question = state.rewritten_question || state.question;

	const docs = state.documents || [];

	const context = docs.map((doc) => doc.pageContent).join("\n\n");

	const prompt = ChatPromptTemplate.fromTemplate(`
You are an expert AI system designer.

Answer ONLY from the provided context.

If answer is unavailable in context,
say:
"I could not find relevant information."

Context:
{context}

Question:
{question}
`);

	const chain = prompt.pipe(groq).pipe(parser);

	const result = await chain.invoke({
		context,
		question,
	});

	console.log("Answer generated successfully");

	return {
		generation: result,
	};
};
