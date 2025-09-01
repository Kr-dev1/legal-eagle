import { auth } from "@/auth";
import { prisma } from "@/lib/prisma/prisma";
import { headers } from "next/headers";
import { redirect } from "next/navigation";

export default async function AuthCallbackPage() {
	const session = await auth.api.getSession({
		headers: await headers(),
	});

	if (!session) {
		redirect("/signin");
	}

	const contracts = await prisma.contractDetails.findMany({
		where: { userID: session.user.id },
		orderBy: { updatedAt: "asc" },
	});

	if (contracts.length > 0) {
		redirect(`/chat/${contracts[0].id}`);
	}

	redirect("/upload");
}




