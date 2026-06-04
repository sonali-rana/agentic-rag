import { loadAndSplitDocs } from "./services/pdfLoader.js";

import { createVectorStore } from "./services/vectorStore.js";

import { buildGraph } from "./graph/graph.js";

const docs = await loadAndSplitDocs();

const vectorStore = await createVectorStore(docs);

const retriever = vectorStore.asRetriever({
	k: 8,
});

export const graph = buildGraph(retriever);

const result = await graph.invoke({
	question:
		"Why does production AI fail when dealing with multi domain documents?",

	retry_count: 0,
});

console.log("Graph execution completed", result.generation);
