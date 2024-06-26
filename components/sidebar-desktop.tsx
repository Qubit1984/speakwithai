import { Sidebar } from "@/components/sidebar";

//import { auth } from '@/auth'
import { ChatHistory } from "@/components/chat-history";
import { createClient } from "@/utils/supabase/server";

export async function SidebarDesktop() {
  const supabase = createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return null;
  }
  // console.log("sidebardesktop", user);
  return (
    <Sidebar className="peer absolute inset-y-0 z-30 hidden -translate-x-full border-r bg-muted duration-300 ease-in-out data-[state=open]:translate-x-0 lg:flex lg:w-[250px] xl:w-[300px]">
      {/* @ts-ignore */}
      <ChatHistory userId={user.id} />
    </Sidebar>
  );
}
