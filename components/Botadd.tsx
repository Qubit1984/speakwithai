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
import { addAiPara } from "@/app/actions";
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
import { CirclePlus } from "lucide-react";
import { nanoid } from "nanoid";
import useStore from "./context";
interface BotaddParams {
  userId: string;
}
export default function Botadd({ userId }: BotaddParams) {
  const [open, setOpen] = React.useState(false);
  const addAistate = useStore((state) => state.addAistate);
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
      name: "chatgpt",
      prompt: "aiPara.prompt",
      listen_language: "ja",
      speak_language: "Takumi",
      temperature: 0,
      should_speak: false,
    },
  });
  async function onSubmit(data: z.infer<typeof FormSchema>) {
    const aipara = {
      id: nanoid(),
      user_id: userId,
      name: data.name,
      prompt: data.prompt,
      max_token: 40960,
      listen_language: data.listen_language,
      speak_language: data.speak_language,
      temperature: data.temperature,
      should_speak: data.should_speak,
    };
    try {
      await addAiPara(aipara);
    } catch (error) {
      // 处理错误，例如输出到控制台或者显示给用户
      console.error("An error occurred:", error);
    }
    addAistate(aipara);
    setOpen(false);
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger className="h-8 flex items-center">
        <CirclePlus className=" mr-2 h-4 w-4" />
        <div
          className="text-center flex justify-between"
          //variant="outline"
        >
          Add a new Bot
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
}
