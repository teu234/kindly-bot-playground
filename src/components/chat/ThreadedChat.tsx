import { useCallback, useEffect, useState, type ReactNode } from "react";
import type { UIMessage } from "ai";
import { MessageSquarePlus, Trash2, Menu, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { loadThreads, saveThreads, titleFrom, type Thread } from "@/lib/threads";
import { ChatWindow, type ChatBot } from "./ChatWindow";
import { BotAvatar } from "./BotAvatar";

type Props = {
  bot: ChatBot;
  scope: string;
  threadId: string;
  onSelect: (id: string) => void;
  onNew: () => void;
  getAuthToken?: (() => Promise<string | undefined>) | undefined;
  banner?: ReactNode;
};

export function ThreadedChat({ bot, scope, threadId, onSelect, onNew, getAuthToken, banner }: Props) {
  const [threads, setThreads] = useState<Thread[] | null>(null);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const sync = () => setThreads(loadThreads(scope));
    sync();
    window.addEventListener("threads-changed", sync);
    return () => window.removeEventListener("threads-changed", sync);
  }, [scope]);

  const persist = useCallback(
    (messages: UIMessage[]) => {
      const rest = loadThreads(scope).filter((t) => t.id !== threadId);
      saveThreads(scope, [{ id: threadId, title: titleFrom(messages), updatedAt: Date.now(), messages }, ...rest]);
    },
    [scope, threadId],
  );

  const remove = (id: string) => {
    saveThreads(scope, loadThreads(scope).filter((t) => t.id !== id));
    if (id === threadId) onNew();
  };
  const clearAll = () => {
    if (!confirm("Apagar todo o histórico de conversas?")) return;
    saveThreads(scope, []);
    onNew();
  };

  const current = threads?.find((t) => t.id === threadId);
  const sorted = [...(threads ?? [])].sort((a, b) => b.updatedAt - a.updatedAt);

  return (
    <div className="flex h-full min-h-0">
      <aside
        className={cn(
          "fixed inset-y-0 left-0 z-40 flex w-72 flex-col border-r border-sidebar-border bg-sidebar text-sidebar-foreground transition-transform md:static md:translate-x-0",
          open ? "translate-x-0" : "-translate-x-full",
        )}
      >
        <div className="flex items-center gap-3 p-4">
          <BotAvatar avatar={bot.avatar} className="size-9 text-xl" />
          <span className="font-display text-lg leading-tight">{bot.name}</span>
          <Button variant="ghost" size="icon-sm" className="ml-auto md:hidden" onClick={() => setOpen(false)} aria-label="Fechar">
            <X />
          </Button>
        </div>
        <div className="px-3">
          <Button className="w-full justify-start" onClick={() => { onNew(); setOpen(false); }}>
            <MessageSquarePlus /> Nova conversa
          </Button>
        </div>
        <nav className="mt-4 flex-1 space-y-1 overflow-y-auto px-3">
          {sorted.length === 0 && <p className="px-2 text-sm text-muted-foreground">Nenhuma conversa ainda.</p>}
          {sorted.map((t) => (
            <div
              key={t.id}
              className={cn(
                "group flex items-center rounded-md text-sm",
                t.id === threadId ? "bg-sidebar-accent text-sidebar-accent-foreground" : "hover:bg-sidebar-accent/60",
              )}
            >
              <button className="flex-1 truncate px-3 py-2 text-left" onClick={() => { onSelect(t.id); setOpen(false); }}>
                {t.title}
              </button>
              <Button variant="ghost" size="icon-xs" className="mr-1 opacity-60 group-hover:opacity-100" onClick={() => remove(t.id)} aria-label="Excluir conversa">
                <Trash2 />
              </Button>
            </div>
          ))}
        </nav>
        {sorted.length > 0 && (
          <div className="p-3">
            <Button variant="ghost" size="sm" className="w-full text-muted-foreground" onClick={clearAll}>
              <Trash2 /> Apagar histórico
            </Button>
          </div>
        )}
      </aside>
      {open && <div className="fixed inset-0 z-30 bg-foreground/30 md:hidden" onClick={() => setOpen(false)} />}
      <main className="flex min-w-0 flex-1 flex-col">
        <div className="flex items-center gap-2 border-b border-border px-3 py-2 md:hidden">
          <Button variant="ghost" size="icon-sm" onClick={() => setOpen(true)} aria-label="Conversas">
            <Menu />
          </Button>
          <span className="truncate text-sm font-medium">{current?.title ?? "Nova conversa"}</span>
        </div>
        {banner}
        <div className="min-h-0 flex-1">
          {threads && (
            <ChatWindow
              key={threadId}
              bot={bot}
              threadId={threadId}
              initialMessages={current?.messages ?? []}
              onMessagesChange={persist}
              getAuthToken={getAuthToken}
            />
          )}
        </div>
      </main>
    </div>
  );
}
