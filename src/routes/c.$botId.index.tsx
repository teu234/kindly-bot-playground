import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useEffect } from "react";
import { loadThreads, newThreadId } from "@/lib/threads";

export const Route = createFileRoute("/c/$botId/")({
  component: PickThread,
});

function PickThread() {
  const { botId } = Route.useParams();
  const navigate = useNavigate();
  useEffect(() => {
    const latest = loadThreads(`public:${botId}`).sort((a, b) => b.updatedAt - a.updatedAt)[0];
    navigate({ to: "/c/$botId/$threadId", params: { botId, threadId: latest?.id ?? newThreadId() }, replace: true });
  }, [botId, navigate]);
  return null;
}
