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
import { updateSelectedAi, deleteAiPara } from "../app/actions";
import EditBotMenu from "./Editbotmenu";
import { redirect } from "next/navigation";
import Botadd from "./Botadd";
import useStore from "./context";
import { useEffect } from "react";
interface BotselectProps {
  AiParas: AiPara[];
  selectedAiId: string | null;
  selectedAiName: string | undefined;
}

export default function Botselect({
  AiParas,
  selectedAiId,
  selectedAiName,
}: BotselectProps) {
  const [dropdownOpen, setDropdownOpen] = React.useState(false);
  const aiparas = useStore((state) => state.aiparas);
  const selectedid = useStore((state) => state.selectedid);
  const selectedname = useStore((state) => state.selectedname);
  const setInitialAistate = useStore((state) => state.setInitialAistate);
  const setSelectedid = useStore((state) => state.setSelectedid);
  const setSelectedName = useStore((state) => state.setSelectedName);
  const deleteAistate = useStore((state) => state.deleteAistate);

  //console.log(aiparas);
  //  console.log("selectedAiId", selectedAiId);

  //console.log("selectedid", selectedid);
  const userId = aiparas[0]?.user_id;
  const generateDropdownMenuSub = (aiparas: AiPara[]) => {
    const handleSelectBot = async (
      userId: string,
      botId: string,
      name: string,
    ) => {
      try {
        await updateSelectedAi(userId, botId);
        redirect("/new");
      } catch (error) {}
      setSelectedid(botId);
      setSelectedName(name);
    };
    const handleDelete = async (botId: string) => {
      try {
        await deleteAiPara(botId);
      } catch (error) {}
      deleteAistate(botId);
    };
    useEffect(() => {
      setInitialAistate(AiParas);
      if (selectedAiId) {
        setSelectedid(selectedAiId);
      }
      if (selectedAiName) {
        setSelectedName(selectedAiName);
      }
      console.log("selectedname", selectedname);
    }, []);
    return aiparas.map((aiPara) => (
      <DropdownMenuSub key={aiPara.id}>
        <DropdownMenuSubTrigger className="h-12">
          {aiPara.id === selectedid ? (
            <CircleCheckBig className="mr-2 h-4 w-4" />
          ) : null}
          <span>{aiPara.name}</span>
        </DropdownMenuSubTrigger>
        <DropdownMenuPortal>
          <DropdownMenuSubContent>
            <DropdownMenuItem
              className="h-10 flex justify-center cursor-pointer"
              onClick={() =>
                handleSelectBot(aiPara.user_id, aiPara.id, aiPara.name)
              }
            >
              {aiPara.id === selectedid ? (
                <CircleCheckBig className="mr-2 h-4 w-4" />
              ) : null}
              <p>Select Bot</p>
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
        <div className="ml-2 hidden md:block">{selectedname}</div>
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
          {generateDropdownMenuSub(aiparas)}
          <DropdownMenuSeparator />
          <DropdownMenuItem
            className="h-12"
            onSelect={(e) => e.preventDefault()}
          >
            <Botadd userId={userId} />
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
}
