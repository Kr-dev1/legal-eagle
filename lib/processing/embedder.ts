import { Document } from "@langchain/core/documents";
import { RecursiveCharacterTextSplitter } from "@langchain/textsplitters";
import { GoogleGenAI } from "@google/genai";
import { prisma } from "../prisma/prisma";
import { ChatGoogleGenerativeAI } from "@langchain/google-genai";
import { tool } from "@langchain/core/tools";
import { z } from "zod";
import { Country } from "@/components/ui/country-dropdown";
import { getRules } from "../laws/getLaws";

type ContractCheckSuccess = {
  success: true;
  valid: boolean;
  documentType: string;
  titleandparties: string;
  detailedSummary: string;
  reason?: string;
};

type ContractCheckError = {
  success: false;
  message: string;
  error: string;
};

type ContractCheckResult = ContractCheckSuccess | ContractCheckError;

export const embedder = async (
  text: string,
  contractId: string,
  userId: string,
  orgCountry: Country,
  userCountry: Country
) => {
  const checkForValidContract = await checkValidContract(text);

  if (!checkForValidContract.success) {
    return {
      success: false,
      message: "Invalid contract text",
      reason: checkForValidContract.error,
    };
  }

  if (!checkForValidContract.valid) {
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

    prisma.contractDetails.update({
      where: { id: contractId },
      data: {
        title: checkForValidContract.titleandparties,
        summary: checkForValidContract.detailedSummary,
        documentType: checkForValidContract.documentType,
      },
    });

    if (checkForValidContract.documentType) {
      try {
        getRules(checkForValidContract.documentType, orgCountry.name);
        getRules(checkForValidContract.documentType, userCountry.name);
      } catch (err) {
        console.error("Failed while fetching local regulations", err);
        getRules(checkForValidContract.documentType, orgCountry.name);
        getRules(checkForValidContract.documentType, userCountry.name);
      }
    }
    const docOutput = await splitter.splitDocuments([
      new Document({ pageContent: text }),
    ]);
    // Generate embeddings
    for (const chunck of docOutput) {
      const response = await textEmbedder(chunck.pageContent);

      const record = await prisma.embeddings.create({
        data: {
          contractId,
          userId,
        },
      });

      const result =
        response &&
        (await prisma.$executeRawUnsafe(
          `UPDATE "Embeddings"
       SET "contractEmbeddings" = $1::vector
       WHERE "id" = $2`,
          JSON.stringify(response),
          record.id
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

const checkValidContract = async (
  text: string
): Promise<ContractCheckResult> => {
  try {
    const llm = new ChatGoogleGenerativeAI({
      model: "gemini-2.5-flash",
      temperature: 0.2,
      apiKey: process.env.GEMINI_API_KEY,
    });
    const contractDetails = z.object({
      valid: z
        .boolean()
        .describe("Indicates if the provided text is a valid contract"),
      reason: z
        .string()
        .optional()
        .describe("Reason for invalidity, if applicable"),
      documentType: z.string().describe("Type of document identified"),
      titleandparties: z
        .string()
        .describe("Title of the document and parties involved"),
      detailedSummary: z.string().describe("Detailed summary of the document"),
    });

    const structuredLlm = llm.withStructuredOutput(contractDetails);
    const result = await structuredLlm.invoke(`
     You are an AI that analyzes text and determines whether it represents a valid document.
     A "valid document" is defined as text that has a clear structure, recognizable sections, and formal content (e.g., contracts, agreements, reports, letters, policies, manuals).
     Your task:
     1.Check if the provided text has indicators of being a real, document that has any clause or any sort of an agreement.
     2.Check for parties that the contract is between.
     Text to analyze:
     """
     ${text}
     """
     `);

    return { success: true, ...result } as ContractCheckSuccess;
  } catch (error) {
    console.error("Error checking valid contract:", error);
    return {
      success: false,
      message: "Failed to check valid contract",
      error: error instanceof Error ? error.message : String(error),
    };
  }
};

export const textEmbedder = async (content: string) => {
  const ai = new GoogleGenAI({
    apiKey: process.env.GEMINI_API_KEY,
  });
  const response = await ai.models.embedContent({
    model: "gemini-embedding-001",
    contents: content,
  });

  return response?.embeddings![0].values;
};
