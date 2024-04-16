"use server";
import "server-only";
//import { Database } from "@/lib/db_types";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { createClient } from "@/utils/supabase/server";
import { type Chat, type AiPara } from "@/lib/types";
import { defaultAiParas } from "@/components/context/default";
export async function getChats(userId?: string | null) {
  const supabase = createClient();
  if (!userId) {
    return [];
  }
  try {
    const { data } = await supabase
      .from("chats")
      .select("id, payload,title,path")
      .order("created_at", { ascending: false })
      .eq("user_id", userId)
      .throwOnError();

    return (
      (data?.map((entry) => ({
        id: entry.id,
        messages: entry.payload,
        title: entry.title,
        path: entry.path,
      })) as Chat[]) ?? []
    );
  } catch (error) {
    return [];
  }
}

export async function getChat(id: string) {
  const supabase = createClient();
  const { data } = await supabase
    .from("chats")
    .select("id,user_id,ai_para,title,payload")
    .eq("id", id)
    .maybeSingle();
  const messages = data?.payload;
  const chat = {
    id: data?.id,
    userId: data?.user_id,
    title: data?.title,
    ai_para: data?.ai_para,
    messages: messages,
  };
  return chat;
}

export async function removeChat({ id, path }: { id: string; path: string }) {
  const supabase = createClient();
  try {
    await supabase.from("chats").delete().eq("id", id).throwOnError();

    revalidatePath("/");
    return revalidatePath(path);
  } catch (error) {
    return {
      error: "Unauthorized",
    };
  }
}

export async function clearChats(userId: string) {
  const supabase = createClient();
  try {
    await supabase.from("chats").delete().eq("user_id", userId);
    revalidatePath("/");
    return redirect("/");
  } catch (error) {
    console.log("clear chats error", error);
  }
}

export async function getSharedChat(id: string) {
  const supabase = createClient();
  const { data } = await supabase
    .from("chats")
    .select("payload")
    .eq("id", id)
    .not("payload->sharePath", "is", null)
    .maybeSingle();

  return (data?.payload as Chat) ?? null;
}

export async function shareChat(chat: Chat) {
  const supabase = createClient();
  const payload = {
    ...chat,
    sharePath: `/share/${chat.id}`,
  };

  await supabase
    .from("chats")
    .update({ payload: payload as any })
    .eq("id", chat.id)
    .throwOnError();

  return payload;
}
export async function getMissingKeys() {
  const keysRequired = ["OPENAI_API_KEY"];
  return keysRequired
    .map((key) => (process.env[key] ? "" : key))
    .filter((key) => key !== "");
}

export async function saveChat(chat: Chat) {
  const supabase = createClient();
  if (chat) {
    const { data, error } = await supabase
      .from("chats")
      .insert([
        {
          id: chat.id,
          user_id: chat.userId,
          ai_para: chat.ai_para,
          title: chat.title,
          created_at: chat.createdAt.toISOString(),
          payload: chat.messages,
          path: chat.path,
        },
      ])
      .select();

    if (error) {
      console.error("Error saving chat:", error);
      return;
    }

    // console.log("Chat saved:", data);
  } else {
    console.log("User is not authenticated.");
  }
}

export async function updateChat(chat: Chat) {
  const supabase = createClient();
  if (chat) {
    let { error } = await supabase
      .from("chats")
      .update({
        payload: chat.messages,
      })
      .eq("id", chat.id);
    if (error) {
      console.error("Error updating chat:", error);
      return;
    }

    //  console.log("Chat payload updated");
  } else {
    console.log("User is not authenticated.");
  }
}

export async function fetchInitialAiPara(userId: string): Promise<AiPara[]> {
  const supabase = createClient();
  const { data, error } = await supabase
    .from("ai_paras")
    .select()
    .eq("user_id", userId);

  if (error) {
    console.error("Error fetching initial AiPara:", error);
    return [];
  }

  return data || [];
}

export async function getSelectedAiPara(userId: string): Promise<AiPara> {
  const supabase = createClient();
  const { data: botdata, error: botError } = await supabase
    .from("settings")
    .select("bot_id")
    .eq("id", userId)
    .single();

  if (botError) {
    console.error("Error getting selected bot ID:", botError);
    return defaultAiParas[0];
  }
  const botId = botdata.bot_id;
  const { data, error } = await supabase
    .from("ai_paras")
    .select()
    .eq("id", botId)
    .single();
  if (error) {
    console.error("Error get AiPara:", error);
    return defaultAiParas[0];
  }

  return data as AiPara;
}

export async function getSelectedAiId(userId: string): Promise<string | null> {
  const supabase = createClient();
  const { data, error } = await supabase
    .from("settings")
    .select("bot_id")
    .eq("id", userId)
    .single();

  if (error) {
    console.error("Error getting chat ID:", error);
  }
  const selectedId = data?.bot_id;
  return selectedId;
}

export async function addAiPara(AiPara: AiPara) {
  const supabase = createClient();
  try {
    await supabase.from("ai_paras").insert([AiPara]);
  } catch (error) {
    console.error("Error inserting AiPara:", error);
  }
}
export async function deleteAiPara(id: string) {
  const supabase = createClient();
  try {
    await supabase.from("ai_paras").delete().eq("id", id);
  } catch (error) {
    console.error("Error deleting AiPara:", error);
  }
}

export async function updateAibot(id: string, aipara: object) {
  const supabase = createClient();
  try {
    await supabase.from("ai_paras").update(aipara).eq("id", id);
  } catch (error) {
    console.error("Error updating data: ", error);
  }
}

export async function updateAiPara(
  id: string,
  property: string,
  newValue: string | number,
) {
  const supabase = createClient();
  try {
    await supabase
      .from("ai_paras")
      .update({ [property]: newValue })
      .eq("id", id);
  } catch (error) {
    console.error("Error updating AiPara:", error);
  }
}
export async function getAiProperty(botId: string, property: any) {
  const supabase = createClient();
  const { data, error } = await supabase
    .from("ai_paras")
    .select(property)
    .eq("id", botId)
    .single();
  if (error) {
    console.error("Error getting Ai Property:", error);
  }
  const aiProperty = data?.[property];
  return aiProperty;
}

export async function updateSelectedAi(id: string, newBotid: string) {
  const supabase = createClient();
  try {
    await supabase.from("settings").update({ bot_id: newBotid }).eq("id", id);
  } catch (error) {
    console.error("Error updating SelectedAi:", error);
  }
}
