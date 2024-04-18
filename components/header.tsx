import * as React from "react";
import Link from "next/link";
//import AuthButton from "./AuthButton";
import { cn } from "@/lib/utils";
import { Button, buttonVariants } from "@/components/ui/button";
import {
  IconGitHub,
  IconNextChat,
  IconSeparator,
  IconVercel,
} from "@/components/ui/icons";
import { UserMenu } from "@/components/user-menu";
import { SidebarMobile } from "./sidebar-mobile";
import { SidebarToggle } from "./sidebar-toggle";
import { ChatHistory } from "./chat-history";
import { createClient } from "@/utils/supabase/server";
//import { Session } from "@/lib/types";
//import { auth } from "@/auth";
import { cookies } from "next/headers";
import Botselect from "./Botselect";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  fetchInitialAiPara,
  getSelectedAiId,
  getAiProperty,
  getSelectedAiPara,
} from "@/app/actions";
import { defaultAiParas } from "@/components/context/default";

async function UserOrLogin() {
  const supabase = createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  return (
    <>
      {user ? (
        <>
          <SidebarMobile>
            <ChatHistory userId={user.id} />
          </SidebarMobile>
          <SidebarToggle />
        </>
      ) : (
        <Link href="/new" rel="nofollow">
          <IconNextChat className="size-6 mr-2 dark:hidden" inverted />
          <IconNextChat className="hidden size-6 mr-2 dark:block" />
        </Link>
      )}
      <div className="flex items-center">
        <IconSeparator className="size-6 text-muted-foreground/50" />
        {user ? (
          <UserMenu user={user} />
        ) : (
          <Button variant="link" asChild className="-ml-2">
            <Link href="/login">Login</Link>
          </Button>
        )}
      </div>
    </>
  );
}

export async function Header() {
  const supabase = createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  const AiParas = user ? await fetchInitialAiPara(user.id) : defaultAiParas;
  /*   const selectedAiId = user ? await getSelectedAiId(user.id) : null; */
  const selectaiPara = user ? await getSelectedAiPara(user.id) : null;
  /* 
  const selectedAiName = selectedAiId
    ? await getAiProperty(selectedAiId, "name")
    : "Default bot";
  const selectedAiListen = selectedAiId
    ? await getAiProperty(selectedAiId, "listen_language")
    : "zh-CN"; */
  return (
    <header className="sticky top-0 z-50 flex items-center justify-between w-full h-16 px-4 border-b shrink-0 bg-gradient-to-b from-background/10 via-background/50 to-background/80 backdrop-blur-xl">
      <div className="flex items-center">
        <React.Suspense fallback={<div className="flex-1 overflow-auto" />}>
          <UserOrLogin />
        </React.Suspense>
      </div>
      <div className="flex items-center justify-end space-x-2">
        {/*  <a
          target="_blank"
          href="https://github.com/Qubit1984/speakwithai"
          rel="noopener noreferrer"
          className={cn(buttonVariants({ variant: "outline" }))}
        >
          <IconGitHub />
          <span className="hidden ml-2 md:flex">GitHub</span>
        </a> */}
        <Botselect
          AiParas={AiParas}
          //  selectedAiId={selectedAiId}
          selectedAiPara={selectaiPara}
          // selectedAilisten={selectedAiListen}
        />
      </div>
    </header>
  );
}
