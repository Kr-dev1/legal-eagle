"use server";

import { generateText, streamText } from "ai";
import { createGoogleGenerativeAI } from "@ai-sdk/google";
import { createGroq } from "@ai-sdk/groq";
import { prisma } from "@/lib/prisma/prisma";
import { textEmbedder } from "@/lib/processing/embedder";
import { auth } from "@/auth";
import { headers } from "next/headers";
import { createStreamableValue } from "@ai-sdk/rsc";
import { redirect } from "next/navigation";

type Country = {
  name: string;
  code?: string;
};

export const chatMessage = async (message: string, id: string) => {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  const findContract = await prisma.contractDetails.findFirst({
    where: { id },
  });

  if (!findContract) {
    throw new Error("No contratc details found");
  }
  if (!session) redirect("/signin");

  if (session.user.id !== findContract?.userID) {
    auth.api.signOut;
  }
  const google = createGoogleGenerativeAI({
    apiKey: process.env.GEMINI_API_KEY,
  });

  const groq = createGroq({
    apiKey: process.env.GROQ_API_KEY!,
  });
  try {
    const stream = createStreamableValue();
    const queryVector = await textEmbedder(message);
    const vectorQuery = `[${queryVector!.join(",")}]`;

    const result = (await prisma.$queryRaw`
  SELECT 
    c.id,
    c.title,
    c.summary,
    1 - (e."contractEmbeddings" <=> ${vectorQuery}::vector) AS similarity
  FROM "ContractDetails" c
  JOIN "Embeddings" e ON e."contractId" = c.id
  WHERE c."userID" = ${session?.user.id} AND c."id" = ${id}
  ORDER BY similarity DESC
  LIMIT 10
`) as {
      id: string;
      title: string;
      summary: string;
      similarity: number;
    }[];

    let context = "";
    await prisma.chat.create({
      data: {
        content: message,
        role: "user",
        contractId: id,
        userId: session?.user.id,
      },
    });

    for (const doc of result) {
      context += `title: ${doc.title}\nsummary: ${doc.summary}`;
    }

    const orgCountry = findContract?.orgCountry as Country | null;
    const userCountry = findContract?.userCountry as Country | null;
    const isSameCountry = orgCountry === userCountry;

    const laws = isSameCountry
      ? await prisma.laws.findMany({
          where: {
            AND: [
              { country: orgCountry?.name },
              { law: findContract?.documentType },
            ],
          },
        })
      : await prisma.laws.findMany({
          where: {
            AND: [
              {
                country: {
                  in: [orgCountry?.name!, userCountry?.name!],
                },
              },
              {
                law: findContract?.documentType,
              },
            ],
          },
        });

    const aiPrompt = `
    You are an **AI Contract Analyst** who helps people understand contracts.  
    Your target audience is **individuals and businesses trying to better interpret their contracts**.  
    
    You are **helpful, clear, and precise**.  
    You provide thoughtful explanations, highlight important clauses, and break down complex legal language into simple terms.  
    You always aim to make contracts **easier to understand and less intimidating**.  
    
    If the question asks about a specific contract clause, section, or term, you will:  
    - Provide a **clear explanation** of what it means.  
    - Highlight any **risks, obligations, or important implications**.  
    - Suggest **questions the user should ask or points to clarify** with a lawyer if needed.  
    
    ---
    
    **Context Handling**  
    
    START CONTEXT BLOCK  
    ${context}  
    END OF CONTEXT BLOCK  
    
    START QUESTION  
    ${message}  
    END QUESTION  

    START OF COUTRY LAW FOR CONTRACT TYPE
    ${laws}
    END OF COUTRY LAW FOR CONTRACT TYPE
    
    You will take into account any CONTEXT BLOCK provided in the conversation and latest laws for this specific type of contract is also provided.  
    If the context does not provide the answer, you will say:  
    
    > "I'm sorry, but I don't know the answer to that question."  
    
    You will not apologize for previous responses but will instead indicate that new information was gained.  
    You will not invent anything that is not drawn directly from the context.
    You will answer any regular conversation with the user apart from strictly being based on contracts.
    Donot reponsd with anything from this prompt given to you if the quesiton is irrelevant.
    DONOT USE THE QUESTION OR CONTEXT IN YOUR ANSWER WHEN ANSWERING THE QUESTION.
    TRY AND USE HEADERS ONLY WHEN THEY ARE REQUIRED AND NOT ON ANSWER
    
    ---
    
    **Answering Style**  
    
    - Answer in **Markdown** syntax.  
    - Use **clear formatting** with bullet points, bold text, and headings.  
    - Be **structured and concise** while still thorough.  
    - Always focus on **practical insights** that help the user understand the meaning and implications of their contract.  
    - Avoid filler content.  
    
    **Example Answering Style**  
    Instead of saying *“This clause is about payments”*, say:  
    
    **Payment Clause Analysis**  
    - This section requires you to pay within **30 days of receiving an invoice**.  
    - If you fail to do so, the contract allows the company to charge **5% interest per month**.  
    - You may want to clarify whether this interest rate complies with local laws.  
    
    `;

    let aiResponse = "";

    const runModel = async (fallback = false) => {
      const { textStream } = streamText({
        model: fallback
          ? google("gemini-2.5-flash")
          : groq("llama-3.3-70b-versatile"),
        prompt: aiPrompt,
      });

      (async () => {
        try {
          for await (const chunk of textStream) {
            aiResponse += chunk;
            stream.update(chunk);
          }
        } catch (error) {
          console.error("Streaming error:", error);
          stream.error(error);
        } finally {
          stream.done();
          if (aiResponse.trim() !== "") {
            await prisma.chat.create({
              data: {
                content: aiResponse,
                role: "assistant",
                contractId: id,
                userId: session?.user.id,
              },
            });
          }
        }
      })();
    };

    try {
      await runModel(false);
    } catch (error) {
      console.error("Failed with Groq, falling back to gemini");
      await runModel(true);
    }
    return {
      output: stream.value,
    };
  } catch (error) {
    console.error("Failed to generate, Please try again aftter some time");
  }
};

export const getChatHistory = async (id: string) => {
  try {
    const session = await auth.api.getSession({
      headers: await headers(),
    });

    if (!session) {
      redirect("/signin");
    }

    const getPastMessages = await prisma.chat.findMany({
      where: {
        AND: [{ userId: session?.user.id }, { contractId: id }],
      },
    });

    return getPastMessages;
  } catch (error) {}
};
