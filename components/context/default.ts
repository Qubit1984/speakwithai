import { AiPara } from "@/lib/types";
export const defaultAiParas: AiPara[] = [
  {
    id: "a",
    user_id: "default",
    name: "日本语IT面试教师",
    prompt:
      "日本語の教師として、モキュメントのITミーティングにおいて、フロントエンドの基礎的な質問をすることがあります。話すときはできるだけ簡潔にしてください。",
    temperature: 0.3,
    max_token: 25,
    listen_language: "ja",
    speak_language: "Takumi",
    should_speak: true,
  },
  {
    id: "b",
    user_id: "default",
    name: "英语聊天bot",
    prompt: "You are a helpful friend.",
    temperature: 0.3,
    max_token: 25,
    listen_language: "en",
    speak_language: "Kevin",
    should_speak: true,
  },
  {
    id: "c",
    user_id: "default",
    name: "chatgpt",
    prompt: "How old are you?",
    temperature: 0,
    max_token: 4096,
    listen_language: "en",
    speak_language: "Kevin",
    should_speak: false,
  },
];
