import { useEffect, useMemo, useRef } from "react";
import { useChat } from "@ai-sdk/react";
import { DefaultChatTransport, type UIMessage } from "ai";
import { toast } from "sonner";
import {
  Conversation,
  ConversationContent,
  ConversationScrollButton,
} from "@/components/ai-elements/conversation";
import { Message, MessageContent, MessageResponse } from "@/components/ai-elements/message";
import {
  PromptInput,
  PromptInputFooter,
  PromptInputSubmit,
  PromptInputTextarea,
  type PromptInputMessage,
} from "@/components/ai-elements/prompt-input";
import { Shimmer } from "@/components/ai-elements/shimmer";
import { Suggestion, Suggestions } from "@/components/ai-elements/suggestion";
import { BotAvatar } from "./BotAvatar";

export type ChatBot = { id: string; name: string; avatar: string; welcome: string; suggestions: string[] };

type Props = {
  bot: ChatBot;
  threadId: string;
  initialMessages: UIMessage[];
  onMessagesChange: (messages: UIMessage[]) => void;
  getAuthToken?: (() => Promise<string | undefined>) | undefined;
};

export function ChatWindow({ bot, threadId, initialMessages, onMessagesChange, getAuthToken }: Props) {
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const transport = useMemo(
    () =>
      new DefaultChatTransport({
        api: "/api/public/chat",
        body: { botId: bot.id },
        headers: async (): Promise<Record<string, string>> => {
          const t = await getAuthToken?.();
          return t ? { Authorization: `Bearer ${t}` } : {};
        },
      }),
    [bot.id, getAuthToken],
  );
  const { messages, sendMessage, status, stop } = useChat({
    id: threadId,
    messages: initialMessages,
    transport,
    onError: (e) => {
      let msg = e.message;
      try {
        msg = JSON.parse(e.message).error ?? msg;
      } catch {
        /* plain text */
      }
      toast.error(msg || "Falha de conexão. Tente novamente.");
    },
  });
  const busy = status === "submitted" || status === "streaming";

  const cbRef = useRef(onMessagesChange);
  cbRef.current = onMessagesChange;
  useEffect(() => {
    if (status === "ready" || status === "error") {
      if (messages.length) cbRef.current(messages);
      textareaRef.current?.focus();
    }
  }, [messages, status]);

  const send = (text: string) => {
    if (!text.trim() || busy) return;
    sendMessage({ text });
  };

  return (
    <div className="flex h-full min-h-0 flex-col">
      <Conversation className="min-h-0 flex-1">
        <ConversationContent className="mx-auto w-full max-w-3xl gap-6 px-4 py-6">
          {messages.length === 0 && (
            <div className="flex flex-col items-center gap-4 pt-10 text-center">
              <BotAvatar avatar={bot.avatar} className="size-16 text-4xl" />
              <h2 className="font-display text-2xl">{bot.name}</h2>
              <p className="max-w-md text-muted-foreground">{bot.welcome}</p>
            </div>
          )}
          {messages.map((m) => (
            <Message from={m.role} key={m.id}>
              <MessageContent>
                {m.parts.map((p, i) =>
                  p.type === "text" ? (
                    m.role === "assistant" ? (
                      <MessageResponse key={i}>{p.text}</MessageResponse>
                    ) : (
                      <p key={i} className="whitespace-pre-wrap">{p.text}</p>
                    )
                  ) : null,
                )}
              </MessageContent>
            </Message>
          ))}
          {status === "submitted" && (
            <div className="flex items-center gap-3">
              <BotAvatar avatar={bot.avatar} className="size-8 text-lg" />
              <Shimmer>{`${bot.name} está digitando...`}</Shimmer>
            </div>
          )}
        </ConversationContent>
        <ConversationScrollButton />
      </Conversation>
      <div className="mx-auto w-full max-w-3xl space-y-3 px-4 pb-4">
        {messages.length === 0 && bot.suggestions.length > 0 && (
          <Suggestions>
            {bot.suggestions.filter(Boolean).map((s) => (
              <Suggestion key={s} suggestion={s} onClick={send} />
            ))}
          </Suggestions>
        )}
        <PromptInput onSubmit={(msg: PromptInputMessage) => send(msg.text ?? "")} className="bg-card">
          <PromptInputTextarea ref={textareaRef} autoFocus placeholder={`Mensagem para ${bot.name}...`} />
          <PromptInputFooter className="justify-end">
            <PromptInputSubmit status={status} onStop={stop} />
          </PromptInputFooter>
        </PromptInput>
      </div>
    </div>
  );
}
