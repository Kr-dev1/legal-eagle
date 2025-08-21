import { Document } from "@langchain/core/documents";
import { RecursiveCharacterTextSplitter } from "@langchain/textsplitters";
import { GoogleGenAI } from "@google/genai";
import { auth } from "@/auth";
import { headers } from "next/headers";
import { prisma } from "../prisma/prisma";
import { ChatGoogleGenerativeAI } from "@langchain/google-genai";
import { tool } from "@langchain/core/tools";
import z from "zod";

export const embedder = async (
  text: string,
  contractId: string,
  userId: string,
) => {
  const checkForValidContract = await checkValidContract(text);
  if (checkForValidContract && !checkForValidContract.valid) {
    return {
      success: false,
      message: "Invalid contract text",
      reason: checkForValidContract.reason,
    };
  }
  try {
    const splitter = new RecursiveCharacterTextSplitter({
      chunkSize: 1000,
      chunkOverlap: 200,
    });

    const docOutput = await splitter.splitDocuments([
      new Document({ pageContent: text }),
    ]);

    const ai = new GoogleGenAI({
      apiKey: process.env.GEMINI_API_KEY,
    });

    // Generate embeddings
    for (const chunck of docOutput) {
      const response = await ai.models.embedContent({
        model: "gemini-embedding-001",
        contents: chunck.pageContent,
      });

      const record = await prisma.embeddings.create({
        data: {
          contractId,
          userId,
        },
      });

      const result =
        response.embeddings &&
        (await prisma.$executeRawUnsafe(
          `UPDATE "Embeddings"
       SET "contractEmbeddings" = $1::vector
       WHERE "id" = $2`,
          JSON.stringify(response?.embeddings![0].values),
          record.id,
        ));
    }

    return { success: true, message: "Embeddings generated successfully" };
  } catch (error) {
    console.error("Error generating embeddings:", error);
    return {
      success: false,
      message: "Failed to generate embeddings",
      error: error instanceof Error ? error.message : String(error),
    };
  }
};

const checkValidContract = async (text: string) => {
  try {
    const llm = new ChatGoogleGenerativeAI({
      model: "gemini-2.5-flash",
      temperature: 0.2,
      apiKey: process.env.GEMINI_API_KEY,
    });

    const responseSchema = z.object({
      valid: z
        .boolean()
        .describe("Indicates if the provided text is a valid contract"),
      reason: z
        .string()
        .optional()
        .describe("Reason for invalidity, if applicable"),
      documentType: z.string().describe("Type of document identified"),
    });

    const reponseFormatterTool = tool(async () => {}, {
      name: "responseFormatterTool",
      schema: responseSchema,
    });

    const modelWithTools = llm.bindTools([reponseFormatterTool]);

    const response = await modelWithTools.invoke(`
    You are an AI that analyzes text and determines whether it represents a valid document.
    A "valid document" is defined as text that has a clear structure, recognizable sections, and formal content (e.g., contracts, agreements, reports, letters, policies, manuals).

    Your task:
    1. Check if the provided text has indicators of being a real, document that has any clause or any sort of an agreement.

    Text to analyze:
    """
    ${text}
    """
    `);
    if (response.tool_calls) {
      return response.tool_calls[0].args;
    }
  } catch (error) {
    console.error("Error checking valid contract:", error);
    return {
      success: false,
      message: "Failed to check valid contract",
      error: error instanceof Error ? error.message : String(error),
    };
  }
};
