import { createOpenAI } from "@ai-sdk/openai";
import { convertToModelMessages, streamText, type UIMessage } from "ai";
import {
  createLovableAiGatewayRunIdFetch,
  getLovableAiGatewayRunId,
  withLovableAiGatewayRunIdHeader,
} from "./run-id.server";
import { buildSystemPrompt, type BotConfig } from "../prompt";

const MODEL = "openai/gpt-6.1-sol";

export async function streamBotChat(request: Request, bot: BotConfig, messages: UIMessage[]) {
  const apiKey = process.env['LOVABLE_API_KEY'];
  if (!apiKey) return Response.json({ error: "IA não configurada." }, { status: 500 });
  const runIdFetch = createLovableAiGatewayRunIdFetch(getLovableAiGatewayRunId(request));
  const provider = createOpenAI({
    baseURL: "https://ai.gateway.lovable.dev/v1",
    apiKey,
    headers: { "Lovable-API-Key": apiKey, "X-Lovable-AIG-SDK": "vercel-ai-sdk" },
    fetch: runIdFetch.fetch,
  });
  const result = streamText({
    model: provider.responses(MODEL),
    instructions: buildSystemPrompt(bot),
    messages: await convertToModelMessages(messages.slice(-40)),
    abortSignal: request.signal,
    providerOptions: {
      openai: {
        forceReasoning: true,
        reasoningEffort: "low",
        reasoningSummary: "auto",
        store: false,
        include: ["reasoning.encrypted_content"],
      },
    },
  } as Parameters<typeof streamText>[0]);
  return withLovableAiGatewayRunIdHeader(
    result.toUIMessageStreamResponse({
      originalMessages: messages,
      sendReasoning: false,
      onError: (e) => {
        console.error(e);
        const msg = String((e as Error)?.message ?? "");
        if (msg.includes("429")) return "Muitas mensagens agora. Tente novamente em instantes.";
        if (msg.includes("402")) return "Os créditos de IA acabaram. O dono do assistente precisa adicionar créditos.";
        return "Não consegui responder agora. Tente novamente.";
      },
    }),
    runIdFetch,
  );
}
