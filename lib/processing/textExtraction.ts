import { PDFLoader } from "@langchain/community/document_loaders/fs/pdf";
import fs from "fs/promises";
import { embedder } from "./embedder";

export async function loadPdfFromUrl(
  url: string,
  contractId: string,
  userId: string,
) {
  let localPath: string | null = null;

  try {
    const res = await fetch(url);
    if (!res.ok) {
      throw new Error(`Failed to fetch PDF: ${res.status} ${res.statusText}`);
    }
    const buffer = Buffer.from(await res.arrayBuffer());
    localPath = `/tmp/temp-${Date.now()}.pdf`;
    await fs.writeFile(localPath, buffer);
    const loader = new PDFLoader(localPath);
    const docs = await loader.load();
    return await embedder(docs[0].pageContent, contractId, userId);
  } catch (error) {
    return {
      success: false,
      message: "Failed to load PDF from URL",
      error: error instanceof Error ? error.message : String(error),
    };
  } finally {
    if (localPath) {
      try {
        await fs.unlink(localPath);
      } catch (error) {
        console.warn("Failed to cleanup temp file:", error);
      }
    }
  }
}
