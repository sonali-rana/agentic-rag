import { AgentState } from "../graph/state.js";

export const retrieveDocs =
	(retriever: any) => async (state: typeof AgentState.State) => {
		const docs = await retriever.invoke(state.rewritten_question);

		console.log(`Retrieved ${docs.length} documents`);

		return {
			documents: docs,
		};
	};
