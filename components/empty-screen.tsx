import { UseChatHelpers } from "ai/react";

import { Button } from "@/components/ui/button";
import { ExternalLink } from "@/components/external-link";
import { IconArrowRight } from "@/components/ui/icons";

const exampleMessages = [
  {
    heading: "Explain technical concepts",
    message: `What is a "serverless function"?`,
  },
  {
    heading: "Summarize an article",
    message: "Summarize the following article for a 2nd grader: \n",
  },
  {
    heading: "Draft an email",
    message: `Draft an email to my boss about the following: \n`,
  },
];

export function EmptyScreen() {
  return (
    <div className="mx-auto max-w-2xl px-4">
      <div className="flex flex-col gap-2 rounded-lg border bg-background p-8">
        <h1 className="text-lg font-semibold">
          Welcome to Speak with AI Chatbot!
        </h1>
        <p className="leading-normal text-muted-foreground">
          This is an AI chatbot app template built with{" "}
          <ExternalLink href="https://nextjs.org">Next.js</ExternalLink>, the{" "}
          <ExternalLink href="https://platform.openai.com">
            Openai api
          </ExternalLink>
          ,{" "}
          <ExternalLink href="https://sdk.vercel.ai">
            Vercel AI SDK
          </ExternalLink>
          , <ExternalLink href="https://supabase.com">Supabase</ExternalLink> ,{" "}
          <ExternalLink href="https://vercel.com/storage/kv">
            Deepgram
          </ExternalLink>
          , and{" "}
          <ExternalLink href="https://docs.aws.amazon.com/polly/latest/dg/what-is.html">
            AWS Polly
          </ExternalLink>
          .
        </p>
        <p className="leading-normal text-muted-foreground">
          You can customize AI&apos;s prompt words, speaking language, and
          listening language.Please register to use the customize features. By
          default, the AI speaks in Japanese and listens to Japanese
          pronunciation.
        </p>
      </div>
    </div>
  );
}
