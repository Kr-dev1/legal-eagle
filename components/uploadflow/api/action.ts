"use server";

import { auth } from "@/auth";
import { Country } from "@/components/ui/country-dropdown";
import { prisma } from "@/lib/prisma/prisma";
import { loadPdfFromUrl } from "@/lib/processing/textExtraction";
import { headers } from "next/headers";

type Submission = {
  fileUrl: string;
  fileKey: string;
  userCountry: Country;
  orgCountry: Country;
};

export async function submitContract(data: Submission) {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session) {
    return {
      success: false,
      message: "Please sign in to upload and analyse a contract.",
    };
  }

  if (!data.fileKey || !data.fileUrl || !data.orgCountry || !data.userCountry) {
    return {
      success: false,
      message: "Missing fields. Please confirm all required fields are filled.",
    };
  }

  const saveContractDetails = await prisma.contractDetails.create({
    data: {
      fileKey: data.fileKey,
      fileUrl: data.fileUrl,
      orgCountry: JSON.parse(JSON.stringify(data.orgCountry)),
      userCountry: JSON.parse(JSON.stringify(data.userCountry)),
      userID: session.user.id,
    },
  });

  try {
    const response = await loadPdfFromUrl(
      saveContractDetails.fileUrl,
      saveContractDetails.id,
      session.user.id,
      data.orgCountry,
      data.userCountry,
    );
    return { id: saveContractDetails.id, ...response };
  } catch (err) {
    console.error("Error loading PDF from URL:", err);
    await prisma.contractDetails.delete({
      where: { id: saveContractDetails.id },
    });
    return {
      success: false,
      message: "Failed to process the contract. Please try again later.",
    };
  }
}
