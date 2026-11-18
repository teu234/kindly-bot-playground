import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { Copy, ExternalLink, FlaskConical, Plus, Save, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { BotAvatar } from "@/components/chat/BotAvatar";
import { useAuth } from "@/hooks/use-auth";
import { useMyBot, type Bot } from "@/hooks/use-my-bot";
import { TONES } from "@/lib/prompt";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/painel/")({ component: Settings });

const EMOJIS = ["🤖", "💬", "🦉", "🌿", "☕", "🛍️", "🩺", "🏠", "⚡", "🎧", "🐙", "🌟"];

function Section({ title, desc, children }: { title: string; desc: string; children: React.ReactNode }) {
  return (
    <section className="rounded-2xl border border-border bg-card p-6">
      <h2 className="font-display text-xl">{title}</h2>
      <p className="mb-5 text-sm text-muted-foreground">{desc}</p>
      <div className="space-y-4">{children}</div>
    </section>
  );
}

function Settings() {
  const { user } = useAuth();
  const { data: bot, save, isLoading, error } = useMyBot(user?.id);
  const [form, setForm] = useState<Bot | null>(null);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (bot) setForm(bot);
  }, [bot]);

  if (error) return <p className="p-6 text-destructive">Erro ao carregar: {error.message}</p>;
  if (isLoading || !form) return <p className="p-6 text-muted-foreground">Carregando...</p>;

  const set = <K extends keyof Bot>(k: K, v: Bot[K]) => setForm({ ...form, [k]: v });
  const dirty = JSON.stringify(form) !== JSON.stringify(bot);
  const shareUrl = typeof window !== "undefined" ? `${window.location.origin}/c/${form.id}` : `/c/${form.id}`;

  const onSave = async () => {
    setSaving(true);
    try {
      const { id, owner_id, created_at, updated_at, ...patch } = form;
      void owner_id; void created_at; void updated_at;
      await save(id, { ...patch, suggestions: patch.suggestions.map((s) => s.trim()).filter(Boolean) });
      toast.success("Configurações salvas!");
    } catch (e) {
      toast.error((e as Error).message);
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="h-full overflow-y-auto">
      <div className="mx-auto grid max-w-6xl gap-6 p-4 md:p-8 lg:grid-cols-[1fr_340px]">
        <div className="space-y-6">
          <Section title="Identidade" desc="Como seu assistente se apresenta.">
            <div className="space-y-1.5">
              <Label htmlFor="name">Nome do bot</Label>
              <Input id="name" value={form.name} onChange={(e) => set("name", e.target.value)} maxLength={60} />
            </div>
            <div className="space-y-2">
              <Label>Avatar</Label>
              <div className="flex flex-wrap gap-2">
                {EMOJIS.map((e) => (
                  <button
                    key={e}
                    onClick={() => set("avatar", e)}
                    className={cn("flex size-10 items-center justify-center rounded-full border text-xl transition", form.avatar === e ? "border-primary ring-2 ring-primary/40" : "border-border hover:bg-muted")}
                  >
                    {e}
                  </button>
                ))}
              </div>
              <Input placeholder="Ou cole o link de uma imagem (https://...)" value={/^https?:/.test(form.avatar) ? form.avatar : ""} onChange={(e) => set("avatar", e.target.value || "🤖")} />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="welcome">Mensagem de boas-vindas</Label>
              <Input id="welcome" value={form.welcome} onChange={(e) => set("welcome", e.target.value)} />
            </div>
          </Section>

          <Section title="Personalidade e tom de voz" desc="O jeito de falar do seu assistente.">
            <div className="grid gap-2 sm:grid-cols-2">
              {TONES.map((t) => (
                <button
                  key={t.value}
                  onClick={() => set("tone", t.value)}
                  className={cn("rounded-xl border p-3 text-left transition", form.tone === t.value ? "border-primary bg-primary/5 ring-1 ring-primary" : "border-border hover:bg-muted")}
                >
                  <div className="font-medium">{t.label}</div>
                  <div className="text-xs text-muted-foreground">{t.hint}</div>
                </button>
              ))}
            </div>
          </Section>

          <Section title="Empresa e instruções" desc="Contexto do negócio e regras de comportamento.">
            <div className="space-y-1.5">
              <Label htmlFor="company">Informações da empresa</Label>
              <Textarea id="company" rows={4} placeholder="Ex.: Somos a Padaria Aurora, em Curitiba. Abrimos de seg. a sáb., 7h às 20h..." value={form.company_info} onChange={(e) => set("company_info", e.target.value)} />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="instr">Instruções personalizadas</Label>
              <Textarea id="instr" rows={4} placeholder="Ex.: Sempre ofereça o cardápio do dia. Nunca prometa entrega em menos de 40 min." value={form.instructions} onChange={(e) => set("instructions", e.target.value)} />
            </div>
          </Section>

          <Section title="Base de conhecimento" desc="Perguntas frequentes, regras de atendimento e contexto. O bot responde com base nisso.">
            <Textarea rows={10} className="font-mono text-sm" placeholder={"P: Vocês entregam?\nR: Sim, num raio de 5 km, taxa de R$ 6.\n\nP: Aceitam Pix?\nR: Sim, Pix, cartão e dinheiro.\n\nRegra: pedidos de reembolso devem ir para contato@empresa.com"} value={form.knowledge} onChange={(e) => set("knowledge", e.target.value)} />
          </Section>

          <Section title="Sugestões rápidas" desc="Botões que aparecem para o cliente iniciar a conversa.">
            {form.suggestions.map((s, i) => (
              <div key={i} className="flex gap-2">
                <Input value={s} onChange={(e) => set("suggestions", form.suggestions.map((x, j) => (j === i ? e.target.value : x)))} />
                <Button variant="ghost" size="icon" aria-label="Remover" onClick={() => set("suggestions", form.suggestions.filter((_, j) => j !== i))}><X /></Button>
              </div>
            ))}
            {form.suggestions.length < 6 && (
              <Button variant="outline" size="sm" onClick={() => set("suggestions", [...form.suggestions, ""])}><Plus /> Adicionar sugestão</Button>
            )}
          </Section>
        </div>

        <aside className="space-y-4 lg:sticky lg:top-8 lg:self-start">
          <Button className="w-full" size="lg" onClick={onSave} disabled={!dirty || saving}>
            <Save /> {saving ? "Salvando..." : dirty ? "Salvar alterações" : "Tudo salvo"}
          </Button>

          <div className="overflow-hidden rounded-2xl border border-border bg-card">
            <div className="border-b border-border px-4 py-2 text-xs uppercase tracking-wider text-muted-foreground">Pré-visualização</div>
            <div className="space-y-4 bg-background p-5">
              <div className="flex flex-col items-center gap-2 text-center">
                <BotAvatar avatar={form.avatar} className="size-14 text-3xl" />
                <div className="font-display text-lg">{form.name || "Assistente"}</div>
                <p className="text-sm text-muted-foreground">{form.welcome}</p>
              </div>
              <div className="flex flex-wrap justify-center gap-1.5">
                {form.suggestions.filter(Boolean).map((s) => (
                  <span key={s} className="rounded-full border border-border px-3 py-1 text-xs">{s}</span>
                ))}
              </div>
            </div>
            <div className="border-t border-border p-3">
              <Button asChild variant="secondary" className="w-full">
                <Link to="/painel/teste"><FlaskConical /> Testar conversa</Link>
              </Button>
            </div>
          </div>

          <div className="space-y-3 rounded-2xl border border-border bg-card p-4">
            <div className="flex items-center justify-between">
              <div>
                <div className="font-medium">Link público</div>
                <div className="text-xs text-muted-foreground">{form.is_public ? "Clientes podem conversar" : "Desativado para clientes"}</div>
              </div>
              <Switch checked={form.is_public} onCheckedChange={(v) => set("is_public", v)} />
            </div>
            <div className="flex gap-2">
              <Input readOnly value={shareUrl} className="text-xs" onFocus={(e) => e.target.select()} />
              <Button variant="outline" size="icon" aria-label="Copiar link" onClick={() => { navigator.clipboard.writeText(shareUrl); toast.success("Link copiado!"); }}><Copy /></Button>
            </div>
            <Button asChild variant="ghost" size="sm" className="w-full">
              <a href={shareUrl} target="_blank" rel="noreferrer"><ExternalLink /> Abrir como cliente</a>
            </Button>
          </div>
        </aside>
      </div>
    </div>
  );
}
