"use client";
import * as React from "react";
import { Button, buttonVariants } from "./ui/button";
import {
  DropdownMenu,
  DropdownMenuItem,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
  DropdownMenuSub,
  DropdownMenuSubTrigger,
  DropdownMenuPortal,
  DropdownMenuSubContent,
} from "./ui/dropdown-menu";
import { Trash2, CircleCheckBig } from "lucide-react";
import { IconSliders } from "./ui/icons";
import { cn } from "../lib/utils";
import { AiPara } from "lib/types";
import { updateSelectedAi, deleteAiPara } from "@/app/actions";
import EditBotMenu from "./Editbotmenu";
import { redirect } from "next/navigation";
import Botadd from "./Botadd";
import useStore from "./context";
import { useEffect } from "react";
import Link from "next/link";
import { set } from "zod";

interface BotselectProps {
  AiParas: AiPara[];
  selectedAiPara: AiPara | null;
}

export default function Botselect({ AiParas, selectedAiPara }: BotselectProps) {
  // const router = useRouter();
  const [dropdownOpen, setDropdownOpen] = React.useState(false);
  const aiparas = useStore((state) => state.aiparas);
  const selectedai = useStore((state) => state.selectedai);
  //const selectedname = useStore((state) => state.selectedname);
  const setInitialAistate = useStore((state) => state.setInitialAistate);
  const setSelectedai = useStore((state) => state.setSelectedai);
  const deleteAistate = useStore((state) => state.deleteAistate);

  const userId = selectedai?.user_id;
  const GenerateDropdownMenuSub = (aiparas: AiPara[]) => {
    const handleSelectBot = async (aiPara: AiPara) => {
      try {
        await updateSelectedAi(userId, aiPara.id);
      } catch (error) {}
      setSelectedai(aiPara);
    };
    const handleDelete = async (botId: string) => {
      try {
        await deleteAiPara(botId);
      } catch (error) {}
      deleteAistate(botId);
    };
    useEffect(() => {
      setInitialAistate(AiParas);
      if (selectedAiPara) {
        setSelectedai(selectedAiPara);
      }
    }, []);
    return aiparas.map((aiPara) => (
      <DropdownMenuSub key={aiPara.id}>
        <DropdownMenuSubTrigger className="h-12">
          {aiPara.id === selectedai.id ? (
            <CircleCheckBig className="mr-2 h-4 w-4" />
          ) : null}
          <span>{aiPara.name}</span>
        </DropdownMenuSubTrigger>
        <DropdownMenuPortal>
          {userId ? (
            <DropdownMenuSubContent>
              <DropdownMenuItem
                className="h-10 flex justify-center cursor-pointer"
                onClick={() => handleSelectBot(aiPara)}
              >
                {aiPara.id === selectedai.id ? (
                  <CircleCheckBig className="mr-2 size-4" />
                ) : null}
                <Link href={"/"}>Select Bot</Link>
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem
                className="h-10 flex justify-center"
                onSelect={(e) => e.preventDefault()}
              >
                <EditBotMenu aiPara={aiPara} />
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem
                className="h-10 flex justify-center cursor-pointer"
                onClick={() => handleDelete(aiPara.id)}
              >
                <Trash2 className="text-red-600 mr-2 h-4 w-4" />
                <span className="text-red-600">Delete Bot</span>
              </DropdownMenuItem>
            </DropdownMenuSubContent>
          ) : (
            <DropdownMenuSubContent>
              <DropdownMenuItem
                className="h-10 flex justify-center cursor-pointer
             "
              >
                <Link href="/login">Please log in to Select Bot</Link>
              </DropdownMenuItem>
            </DropdownMenuSubContent>
          )}
        </DropdownMenuPortal>
      </DropdownMenuSub>
    ));
  };

  return (
    <div className="flex items-center">
      <Button variant="ghost" className="pl-0 flex items-center">
        <div className="flex pl-3 shrink-0 select-none items-center   justify-center  bg-muted/50 text-sm font-medium uppercase text-muted-foreground">
          Selected bot :
        </div>
        <div className="ml-2 hidden md:block">{selectedai.name}</div>
      </Button>
      <DropdownMenu onOpenChange={setDropdownOpen} open={dropdownOpen}>
        <DropdownMenuTrigger asChild>
          <Button
            variant="outline"
            onClick={(e) => {
              setDropdownOpen(!dropdownOpen);
            }}
            className={cn(buttonVariants())}
          >
            <IconSliders className="mr-2" />
            <span className=" sm:block">Select Bot</span>
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent className="w-56 ">
          <DropdownMenuLabel>Your AI Bots</DropdownMenuLabel>
          <DropdownMenuSeparator />
          {GenerateDropdownMenuSub(aiparas)}
          <DropdownMenuSeparator />
          <DropdownMenuItem
            className="h-12"
            onSelect={(e) => e.preventDefault()}
          >
            {userId ? <Botadd userId={userId} /> : null}
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
}
