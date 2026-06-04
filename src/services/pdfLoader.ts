import fs from "fs";
import path from "path";

import { PDFLoader } from "@langchain/community/document_loaders/fs/pdf";
import { RecursiveCharacterTextSplitter } from "@langchain/textsplitters";

const PDF_FOLDER = "./assets/pdfs";

export const loadAndSplitDocs = async () => {
	const pdfFiles = fs
		.readdirSync(PDF_FOLDER)
		.filter((file) => file.endsWith(".pdf"));

	let docs = [];

	for (const file of pdfFiles) {
		const loader = new PDFLoader(path.join(PDF_FOLDER, file));

		const pdfDocs = await loader.load();

		docs.push(...pdfDocs);
	}

	console.log("Loaded Docs:", docs.length);

	const splitter = new RecursiveCharacterTextSplitter({
		chunkSize: 1000,
		chunkOverlap: 200,
	});

	const splitDocs = await splitter.splitDocuments(docs);

	console.log("Split Docs:", splitDocs.length);

	const cleanedDocs = splitDocs.map((doc) => ({
		pageContent: doc.pageContent,
		metadata: {
			source: String(doc.metadata?.source || ""),
			page: Number(doc.metadata?.loc?.pageNumber || 0),
		},
	}));

	return cleanedDocs;
};
