import { auth } from "@/auth";
import { prisma } from "@/lib/prisma/prisma";

export const GET = async (req: Request) => {
  try {
    const session = await auth.api.getSession({
      headers: req.headers,
    });

    if (!session) {
      return Response.json({
        success: false,
        message: "Invalid session please Login",
        status: "401",
      });
    }

    const userId = session?.user.id;

    const contracts = await prisma.contractDetails.findMany({
      where: { userID: userId },
      orderBy: {
        updatedAt: "asc",
      },
    });

    return Response.json({
      data: contracts,
      success: true,
      status: 200,
    });
  } catch (error) {
    return Response.json({
      success: false,
      message: "Falied to get contract details",
      status: 500,
    });
  }
};
