import { createFileRoute, getRouteApi, useNavigate } from "@tanstack/react-router";
import { ThreadedChat } from "@/components/chat/ThreadedChat";
import { newThreadId } from "@/lib/threads";

const parent = getRouteApi("/c/$botId");

export const Route = createFileRoute("/c/$botId/$threadId")({
  component: PublicChat,
});

function PublicChat() {
  const { bot } = parent.useLoaderData();
  const { botId, threadId } = Route.useParams();
  const navigate = useNavigate();
  const go = (id: string) => navigate({ to: "/c/$botId/$threadId", params: { botId, threadId: id } });

  if (!bot.is_public) {
    return (
      <div className="flex h-dvh items-center justify-center p-6 text-center text-muted-foreground">
        Este atendimento está temporariamente indisponível.
      </div>
    );
  }
  return (
    <div className="h-dvh">
      <ThreadedChat
        bot={bot}
        scope={`public:${botId}`}
        threadId={threadId}
        onSelect={go}
        onNew={() => go(newThreadId())}
      />
    </div>
  );
}
