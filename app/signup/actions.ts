"use server";
import { redirect } from "next/navigation";
import { ResultCode, getStringFromBuffer } from "@/lib/utils";
import { z } from "zod";
import { kv } from "@vercel/kv";
//import { getUser } from "../login/actions";
import { AuthError } from "next-auth";
import { headers } from "next/headers";
import { createClient } from "@/utils/supabase/server";

interface Result {
  type: string;
  resultCode: ResultCode;
}

export const signUp = async (formData: FormData) => {
  "use server";

  const origin = headers().get("origin");
  const email = formData.get("email") as string;
  const password = formData.get("password") as string;
  const supabase = createClient();

  const { error } = await supabase.auth.signUp({
    email,
    password,
  });

  if (error) {
    return redirect("/login?message=Could not authenticate user");
  }

  return redirect(
    "/confirm-email?message=Check email to continue sign in process",
  );
};
