import Chat from "@/components/chat/chat";
import React from "react";

const page = async ({
  params,
}: {
  params: Promise<{ id: string }>
}) => {
  const { id } = await params

  return (
    <div className="flex w-full h-full">
      <Chat id={id} />
    </div>
  );
};

export default page;
