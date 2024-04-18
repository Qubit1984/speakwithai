import { type EmailOtpType } from "@supabase/supabase-js";
import { type NextRequest, NextResponse } from "next/server";
import { defaultAiParas } from "@/components/context/default";
import { createClient } from "@/utils/supabase/server";
import { nanoid } from "nanoid";

async function insertDefaultData(userId: string) {
  const supabase = createClient();
  const updatedAiParas = defaultAiParas.map((aiPara) => ({
    ...aiPara,
    id: nanoid(),
    user_id: userId,
  }));

  try {
    const { error } = await supabase.from("ai_paras").insert(updatedAiParas);

    if (error) {
      console.error("Error inserting default data:", error);
    } else {
      console.log("Default data inserted successfully");
    }
  } catch (error) {
    console.error("Error inserting default data:", error);
  }
}
export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const token_hash = searchParams.get("token_hash");
  const type = searchParams.get("type") as EmailOtpType | null;
  const next = searchParams.get("next") ?? "/";

  const redirectTo = request.nextUrl.clone();
  redirectTo.pathname = next;
  redirectTo.searchParams.delete("token_hash");
  redirectTo.searchParams.delete("type");

  if (token_hash && type) {
    const supabase = createClient();

    const { error } = await supabase.auth.verifyOtp({
      type,
      token_hash,
    });
    if (!error) {
      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (user) {
        try {
          await insertDefaultData(user.id);
          console.log("Default data inserted successfully");
        } catch (error) {
          console.error("Error inserting default data:", error);
        }
        redirectTo.searchParams.delete("next");
        return NextResponse.redirect(redirectTo);
      }
    }
  }

  // return the user to an error page with some instructions
  redirectTo.pathname = "/error";
  return NextResponse.redirect(redirectTo);
}
