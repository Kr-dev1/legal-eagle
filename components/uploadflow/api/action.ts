"use server";

import { auth } from "@/auth";
import { Country } from "@/components/ui/country-dropdown";
import { prisma } from "@/lib/prisma/prisma";
import { headers } from "next/headers";

type Submission = {
  fileUrl: string;
  fileKey: string;
  userCountry: Country | null;
  orgCountry: Country | null;
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
      orgCountry: data.orgCountry,
      userCountry: data.userCountry,
      userID: session.user.id,
    },
  });
  return {
    success: true,
    message: "Your contract is being analysed",
    id: saveContractDetails.id,
  };
}
