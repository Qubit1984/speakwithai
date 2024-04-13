import { nanoid } from "@/lib/utils";
import { Chat } from "@/components/chat";
import { AI } from "@/lib/chat/actions";
import { getMissingKeys } from "../actions";
import { createClient } from "@/utils/supabase/server";

export const metadata = {
  title: "AI Voice Chatbot",
};

export default async function IndexPage() {
  const supabase = createClient();
  const id = nanoid();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  const missingKeys = await getMissingKeys();

  return (
    <AI initialAIState={{ chatId: id, messages: [] }}>
      <Chat id={id} user={user} missingKeys={missingKeys} />
    </AI>
  );
}
