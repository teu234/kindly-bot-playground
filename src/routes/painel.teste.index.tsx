import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useEffect } from "react";
import { newThreadId } from "@/lib/threads";

export const Route = createFileRoute("/painel/teste/")({ component: Pick });

function Pick() {
  const navigate = useNavigate();
  useEffect(() => {
    navigate({ to: "/painel/teste/$threadId", params: { threadId: newThreadId() }, replace: true });
  }, [navigate]);
  return null;
}
