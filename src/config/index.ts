import { ChatGroq } from "@langchain/groq";
import { GoogleGenerativeAIEmbeddings } from "@langchain/google-genai";
import dotenv from "dotenv";

dotenv.config();

//Groq client
export const groq = new ChatGroq({
	apiKey: process.env.GROQ_API_KEY,
	model: "llama-3.1-8b-instant", // or llama3-70b-8192
	temperature: 0,
});

//embeddings
export const embeddings = new GoogleGenerativeAIEmbeddings({
	apiKey: process.env.GOOGLE_API_KEY,
	modelName: "gemini-embedding-001",
});
