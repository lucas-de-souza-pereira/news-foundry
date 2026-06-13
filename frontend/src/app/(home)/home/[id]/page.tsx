"use client";

import { use } from "react";
import ChatSection from "@/components/chat/chat-section";
import Message from "@/components/chat/message";
import { useAuth } from "@/context/auth-context";

export default function ProjectDetailsPage({
  params,
}: {
  params: Promise<{ id: number }>;
}) {
  const { token } = useAuth();
  const resolvedParams = use(params);
  const chatId = resolvedParams.id;

  return (
    <div>
      <ChatSection token={token} chatId={chatId} />
    </div>
  );
}
