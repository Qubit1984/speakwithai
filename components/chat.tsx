"use client";

import { cn } from "@/lib/utils";
import { ChatList } from "@/components/chat-list";
import { ChatPanel } from "@/components/chat-panel";
import { EmptyScreen } from "@/components/empty-screen";
import { useLocalStorage } from "@/lib/hooks/use-local-storage";
import { useEffect, useState } from "react";
import { useUIState, useAIState } from "ai/rsc";
import { User } from "@supabase/auth-js/dist/module/lib/types";
import { usePathname, useRouter } from "next/navigation";
import { Message } from "@/lib/chat/actions";
import { useScrollAnchor } from "@/lib/hooks/use-scroll-anchor";
import { toast } from "sonner";
import useStore from "./context";

export interface ChatProps extends React.ComponentProps<"div"> {
  initialMessages?: Message[];
  id?: string;
  user: User | null;
  aiName: string | undefined;
  missingKeys: string[];
}
//const supabase = createClient();
export function Chat({ id, aiName, user, missingKeys, className }: ChatProps) {
  const router = useRouter();
  const path = usePathname();
  const [input, setInput] = useState("");
  const [messages] = useUIState();
  const [aiState] = useAIState();

  const setSelectedName = useStore((state) => state.setSelectedName);
  const [_, setNewChatId] = useLocalStorage("newChatId", id);
  //console.log("id", id);

  useEffect(() => {
    if (user) {
      if (!path.includes("chat") && messages.length === 1) {
        window.history.replaceState({}, "", `/chat/${id}`);
      }
    }
  }, [id, path, user, messages]);

  useEffect(() => {
    if (aiName) {
      setSelectedName(aiName);
    }
  }, [aiName]);
  useEffect(() => {
    const messagesLength = aiState.messages?.length;
    if (messagesLength === 2) {
      router.refresh();
    }
  }, [aiState.messages, router]);

  useEffect(() => {
    setNewChatId(id);
  });

  useEffect(() => {
    missingKeys.map((key) => {
      toast.error(`Missing ${key} environment variable!`);
    });
  }, [missingKeys]);

  const { messagesRef, scrollRef, visibilityRef, isAtBottom, scrollToBottom } =
    useScrollAnchor();

  return (
    <div
      className="group w-full overflow-auto pl-0 peer-[[data-state=open]]:lg:pl-[250px] peer-[[data-state=open]]:xl:pl-[300px]"
      ref={scrollRef}
    >
      <div
        className={cn("pb-[200px] pt-4 md:pt-10", className)}
        ref={messagesRef}
      >
        {messages.length ? (
          <ChatList messages={messages} isShared={false} user={user} />
        ) : (
          <EmptyScreen />
        )}
        <div className="h-px w-full" ref={visibilityRef} />
      </div>
      <ChatPanel
        id={id}
        input={input}
        setInput={setInput}
        isAtBottom={isAtBottom}
        scrollToBottom={scrollToBottom}
      />
    </div>
  );
}