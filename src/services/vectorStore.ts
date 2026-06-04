import { Chroma } from "@langchain/community/vectorstores/chroma";

import { embeddings } from "../config/index.js";

export const createVectorStore = async (docs: any[]) => {
	const embeds = await embeddings.embedDocuments(
		docs.map((doc) => doc.pageContent),
	);
	console.log(embeds);
	const vectorStore = await Chroma.fromDocuments(docs, embeddings, {
		collectionName: "agentic-rag",
		url: "http://localhost:8000",
	});

	console.log("Vector store initialized");

	return vectorStore;
};
