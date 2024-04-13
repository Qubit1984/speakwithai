import LoginForm from "@/components/login-form";
//import { Session } from "@/lib/types";
import { redirect } from "next/navigation";
import { createClient } from "@/utils/supabase/server";

export default async function LoginPage() {
  const supabase = createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (user) {
    redirect("/");
  }

  return (
    <main className="flex flex-col p-4">
      <LoginForm />
    </main>
  );
}
