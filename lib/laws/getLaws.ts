import { GoogleGenAI } from "@google/genai";
import { prisma } from "../prisma/prisma";

const ai = new GoogleGenAI({});

export const getRules = async (law: string, country: string) => {
  const res = await prisma.laws.findFirst({
    where: {
      country,
      law,
    },
  });

  const oneMonthAgo = new Date();
  oneMonthAgo.setMonth(oneMonthAgo.getMonth() - 1);

  const shouldFetch =
    !res || !res.updateAt || new Date(res.updateAt) < oneMonthAgo;

  if (shouldFetch) {
    console.log("Fetching");
    const groundingTool = {
      googleSearch: {},
    };

    const config = {
      tools: [groundingTool],
    };

    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: `Find the latest official information about the law "${law}" in ${country}.
                 Return the most relevant and legal references. Find rules that are applicable at a national level`,
      config,
    });

    response && !res
      ? await prisma.laws.create({
          data: {
            country,
            lawContext: response?.text as string,
            law,
          },
        })
      : await prisma.laws.update({
          where: { id: res?.id },
          data: {
            lawContext: response?.text as string,
          },
        });
  }
};

getRules("Mutual Non-Disclosure Agreement (NDA)", "India");
