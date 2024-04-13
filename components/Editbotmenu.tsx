"use client";
import * as React from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { updateAibot } from "../app/actions";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Textarea } from "@/components/ui/textarea";
import { Slider } from "@/components/ui/slider";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { AiPara } from "@/lib/types";
import { PencilLine } from "lucide-react";
import useStore from "./context";
export interface EditBotMenuProps {
  aiPara: AiPara;
}
export default function EditBotMenu({ aiPara }: EditBotMenuProps) {
  const [open, setOpen] = React.useState(false);
  const updateAistate = useStore((state) => state.updateAistate);
  const FormSchema = z.object({
    name: z.string().min(2, {
      message: "Username must be at least 2 characters.",
    }),
    prompt: z.string().min(2, {
      message: "Username must be at least 2 characters.",
    }),
    temperature: z
      .number()
      .min(0, { message: "Temperature must be at least 0." })
      .max(1, { message: "Temperature must be at most 1." }),
    listen_language: z.string().min(2, {
      message: "Listen language must be at least 2 characters.",
    }),
    speak_language: z.string().min(2, {
      message: "Speak language must be at least 2 characters.",
    }),
    should_speak: z.boolean(),
  });
  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      name: aiPara.name,
      prompt: aiPara.prompt,
      listen_language: aiPara.listen_language,
      speak_language: aiPara.speak_language,
      temperature: aiPara.temperature,
      should_speak: aiPara.should_speak,
    },
  });
  async function onSubmit(data: z.infer<typeof FormSchema>) {
    const aipara = {
      name: data.name,
      prompt: data.prompt,
      listen_language: data.listen_language,
      speak_language: data.speak_language,
      temperature: data.temperature,
      should_speak: data.should_speak,
    };

    await updateAibot(aiPara.id, aipara);
    updateAistate(aiPara.id, aipara);
    setOpen(false);
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger className="h-8 flex items-center">
        <PencilLine className=" mr-2 h-4 w-4" />
        <div
          className="text-center flex justify-between"
          //variant="outline"
        >
          Edit Profile
        </div>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Edit Bot</DialogTitle>
          <DialogDescription>
            Make changes to your Bot here. Click save when you&apos;re done.
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Bot name</FormLabel>
                  <FormControl>
                    <Input placeholder="bot name" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="prompt"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Prompt</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Tell us a little bit about yourself"
                      className="resize-none"
                      {...field}
                      rows={4}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="listen_language"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>your language</FormLabel>
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Choose your speaking language" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="ja">Japanese</SelectItem>
                      <SelectItem value="en">English</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="speak_language"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>AI&apos;s language</FormLabel>
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Choose AI's speaking language" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="Takumi">Japanese</SelectItem>
                      <SelectItem value="Kevin">English</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="temperature"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Temperature</FormLabel>
                  <FormControl>
                    <Slider
                      defaultValue={[field.value]}
                      min={0}
                      max={1}
                      step={0.01}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="should_speak"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>AI&apos;s Voice</FormLabel>
                  <FormControl>
                    <Switch
                      checked={field.value}
                      onCheckedChange={field.onChange}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <div className="flex justify-center">
              <Button type="submit">Submit</Button>
              <DialogClose />
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
  b;
}
