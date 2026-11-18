import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { ExternalLink, FlaskConical } from "lucide-react";
import { ThreadedChat } from "@/components/chat/ThreadedChat";
import { Button } from "@/components/ui/button";
import { getAccessToken, useAuth } from "@/hooks/use-auth";
import { useMyBot } from "@/hooks/use-my-bot";
import { newThreadId } from "@/lib/threads";

export const Route = createFileRoute("/painel/teste/$threadId")({ component: TestChat });

function TestChat() {
  const { user } = useAuth();
  const { data: bot } = useMyBot(user?.id);
  const { threadId } = Route.useParams();
  const navigate = useNavigate();
  const go = (id: string) => navigate({ to: "/painel/teste/$threadId", params: { threadId: id } });
  if (!bot) return null;
  return (
    <ThreadedChat
      bot={bot}
      scope={`test:${bot.id}`}
      threadId={threadId}
      onSelect={go}
      onNew={() => go(newThreadId())}
      getAuthToken={getAccessToken}
      banner={
        <div className="flex flex-wrap items-center gap-3 border-b border-border bg-accent/60 px-4 py-2 text-sm text-accent-foreground">
          <FlaskConical className="size-4" />
          <span>Modo de teste — usa as configurações salvas. Conversas de teste ficam separadas das dos clientes.</span>
          <Button asChild variant="outline" size="sm" className="ml-auto">
            <a href={`/c/${bot.id}`} target="_blank" rel="noreferrer">
              <ExternalLink /> Ver como cliente
            </a>
          </Button>
        </div>
      }
    />
  );
}
