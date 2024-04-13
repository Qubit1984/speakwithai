import { Message } from "ai";
//import { User } from "@supabase/auth-js/dist/module/lib/types";
export interface Chat extends Record<string, any> {
  id: string;
  userId: string;
  title: string;
  //createdAt: Date;
  //userId: string;
  path: string;
  messages: Message[];
  //sharePath?: string;
}
export interface AiPara {
  id: string;
  user_id: string;
  name: string;
  prompt: string;
  temperature: number;
  max_token: number;
  listen_language: string;
  speak_language: string;
  should_speak: boolean;
}
/* export interface AiPara {
  id: string;
  user_id: string;
  name: string;
  prompt: string;
  temperature: number;
  max_token: number;
  listen_language: string;
  speak_language: string;
  should_speak: boolean;
} */

export type ServerActionResult<Result> = Promise<
  | Result
  | {
      error: string;
    }
>;
