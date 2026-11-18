import { createFileRoute } from "@tanstack/react-router";
import type { UIMessage } from "ai";

export const Route = createFileRoute("/api/public/chat")({
  server: {
    handlers: {
      POST: async ({ request }) => {
        let body: { messages?: UIMessage[]; botId?: string };
        try {
          body = await request.json();
        } catch {
          return Response.json({ error: "Requisição inválida." }, { status: 400 });
        }
        const { messages, botId } = body;
        if (!Array.isArray(messages) || typeof botId !== "string" || !/^[0-9a-f-]{36}$/i.test(botId)) {
          return Response.json({ error: "Requisição inválida." }, { status: 400 });
        }
        const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
        const { data: bot } = await supabaseAdmin.from("bots").select("*").eq("id", botId).maybeSingle();
        if (!bot) return Response.json({ error: "Assistente não encontrado." }, { status: 404 });
        if (!bot.is_public) {
          // Private bots answer only their owner (test mode).
          const token = request.headers.get("authorization")?.replace(/^Bearer\s+/i, "");
          const { data } = token ? await supabaseAdmin.auth.getUser(token) : { data: { user: null } };
          if (data.user?.id !== bot.owner_id) {
            return Response.json({ error: "Este assistente está desativado." }, { status: 403 });
          }
        }
        const { streamBotChat } = await import("@/lib/ai/chat.server");
        return streamBotChat(request, bot, messages);
      },
    },
  },
});
