import type { UIMessage } from "ai";

export type Thread = { id: string; title: string; updatedAt: number; messages: UIMessage[] };

const key = (scope: string) => `chat-threads:${scope}`;

export function loadThreads(scope: string): Thread[] {
  if (typeof window === "undefined") return [];
  try {
    return JSON.parse(localStorage.getItem(key(scope)) || "[]");
  } catch {
    return [];
  }
}

export function saveThreads(scope: string, threads: Thread[]) {
  localStorage.setItem(key(scope), JSON.stringify(threads));
  window.dispatchEvent(new Event("threads-changed"));
}

export function newThreadId() {
  return crypto.randomUUID().slice(0, 8);
}

export function titleFrom(messages: UIMessage[]): string {
  const first = messages.find((m) => m.role === "user");
  const text = first?.parts.map((p) => (p.type === "text" ? p.text : "")).join(" ").trim();
  return text ? text.slice(0, 48) : "Nova conversa";
}
