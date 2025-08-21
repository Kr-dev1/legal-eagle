import { createUploadthing, type FileRouter } from "uploadthing/next";
import { UploadThingError } from "uploadthing/server";
import { auth } from "@/auth";

const f = createUploadthing();

export const ourFileRouter = {
  pdfUploader: f({
    pdf: { maxFileCount: 1, maxFileSize: "32MB" },
  })
    .middleware(async ({ req }) => {
      const sessionResponse = await auth.api.getSession({
        headers: req.headers,
      });

      const user = sessionResponse?.session?.userId;

      if (!user) {
        throw new UploadThingError("Unauthorized please sign in.");
      }

      return { userId: user };
    })
    .onUploadComplete(async ({ metadata, file }) => {
      return { userID: metadata.userId, file: { ...file } };
    }),
} satisfies FileRouter;

export type OurFileRouter = typeof ourFileRouter;
