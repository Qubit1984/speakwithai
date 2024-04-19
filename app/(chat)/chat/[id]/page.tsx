import { type Metadata } from "next";
import { notFound, redirect } from "next/navigation";

import { getChat, getAiProperty, getMissingKeys } from "@/app/actions";
import { Chat } from "@/components/chat";
import { AI } from "@/lib/chat/actions";
import { createClient } from "@/utils/supabase/server";

export interface ChatPageProps {
  params: {
    id: string;
  };
}

export async function generateMetadata({
  params,
}: ChatPageProps): Promise<Metadata> {
  const supabase = createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return {};
  }
  const chat = await getChat(params.id);
  //console.log("chatidpage chat", params.id, chat);
  return {
    title: chat?.title?.toString().slice(0, 50) ?? "Chat",
  };
}

export default async function ChatPage({ params }: ChatPageProps) {
  const supabase = createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  const missingKeys = await getMissingKeys();

  if (!user) {
    redirect(`/login?next=/chat/${params.id}`);
  }

  const chat = await getChat(params.id);
  const aiParaId = chat.ai_para;
  const aiName = aiParaId
    ? await getAiProperty(aiParaId, "name")
    : "default bot";

  if (!chat) {
    redirect("/");
  }

  if (chat?.userId !== user?.id) {
    redirect("/");
  }

  return (
    <AI initialAIState={{ chatId: chat.id, messages: chat.messages }}>
      <Chat
        id={chat.id}
        user={user}
        aiName={aiName}
        initialMessages={chat.messages}
        missingKeys={missingKeys}
      />
    </AI>
  );
}
