"use server";

import { generateText } from "ai";
import { createGoogleGenerativeAI } from "@ai-sdk/google";
import { createGroq } from "@ai-sdk/groq";
import { prisma } from "@/lib/prisma/prisma";

const google = createGoogleGenerativeAI({
  apiKey: process.env.GEMINI_API_KEY,
});

const groq = createGroq({
  apiKey: process.env.GROQ_API_KEY!,
});

export async function testGroq() {
  const { text } = await generateText({
    model: groq("llama3-70b-8192"),
    prompt: "When do you have data upto?",
  });

  console.log(text);
}

testGroq();
