import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { LovableMark } from "@lovable.dev/cloud-auth-js/react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { supabase } from "@/integrations/supabase/client";
import { lovable } from "@/integrations/lovable/index";
import { useAuth } from "@/hooks/use-auth";

export const Route = createFileRoute("/entrar")({
  head: () => ({
    meta: [
      { title: "Entrar — Atende.ai" },
      { name: "description", content: "Entre para criar e personalizar seu chatbot de atendimento." },
      { property: "og:title", content: "Entrar — Atende.ai" },
      { property: "og:description", content: "Entre para criar e personalizar seu chatbot de atendimento." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
    ],
  }),
  component: Entrar,
});

const GoogleG = () => (
  <svg aria-hidden="true" width="18" height="18" viewBox="0 0 24 24"><path fill="#4285F4" d="M23.49 12.27c0-.79-.07-1.54-.19-2.27H12v4.51h6.47c-.29 1.48-1.14 2.73-2.4 3.58v3h3.86c2.26-2.09 3.56-5.17 3.56-8.82z"/><path fill="#34A853" d="M12 24c3.24 0 5.95-1.08 7.93-2.91l-3.86-3c-1.08.72-2.45 1.16-4.07 1.16-3.13 0-5.78-2.11-6.73-4.96H1.29v3.09C3.26 21.3 7.31 24 12 24z"/><path fill="#FBBC05" d="M5.27 14.29c-.25-.72-.38-1.49-.38-2.29s.14-1.57.38-2.29V6.62H1.29C.47 8.24 0 10.06 0 12s.47 3.76 1.29 5.38l3.98-3.09z"/><path fill="#EA4335" d="M12 4.75c1.77 0 3.35.61 4.6 1.8l3.42-3.42C17.95 1.19 15.24 0 12 0 7.31 0 3.26 2.7 1.29 6.62l3.98 3.09c.95-2.85 3.6-4.96 6.73-4.96z"/></svg>
);

function Entrar() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [mode, setMode] = useState<"in" | "up">("in");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    if (user) navigate({ to: "/painel" });
  }, [user, navigate]);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setBusy(true);
    const { error, data } =
      mode === "in"
        ? await supabase.auth.signInWithPassword({ email, password })
        : await supabase.auth.signUp({ email, password, options: { emailRedirectTo: `${window.location.origin}/painel` } });
    setBusy(false);
    if (error) { toast.error(error.message); return; }
    if (mode === "up" && !data.session) toast.success("Enviamos um link de confirmação para o seu e-mail.");
  };

  const oauth = async (p: "google" | "lovable") => {
    const r = await lovable.auth.signInWithOAuth(p, { redirect_uri: window.location.origin + "/entrar" });
    if (r.error) toast.error(String(r.error.message ?? r.error));
  };

  return (
    <div className="flex min-h-dvh items-center justify-center bg-muted/40 px-4">
      <div className="w-full max-w-sm space-y-6 rounded-2xl border border-border bg-card p-8 shadow-soft">
        <div className="space-y-1 text-center">
          <h1 className="font-display text-3xl">{mode === "in" ? "Bem-vindo de volta" : "Crie sua conta"}</h1>
          <p className="text-sm text-muted-foreground">Gerencie seu assistente de atendimento.</p>
        </div>
        <div className="space-y-2">
          <Button type="button" variant="outline" className="w-full border-[#747775] bg-[#FFFFFF] text-[#1F1F1F] hover:bg-[#F2F2F2]" onClick={() => oauth("google")}>
            <GoogleG /> Continuar com Google
          </Button>
          <Button type="button" variant="outline" className="w-full" onClick={() => oauth("lovable")}>
            <LovableMark /> Continuar com Lovable
          </Button>
        </div>
        <div className="flex items-center gap-3 text-xs text-muted-foreground"><span className="h-px flex-1 bg-border" />ou<span className="h-px flex-1 bg-border" /></div>
        <form onSubmit={submit} className="space-y-3">
          <div className="space-y-1.5"><Label htmlFor="email">E-mail</Label><Input id="email" type="email" required value={email} onChange={(e) => setEmail(e.target.value)} /></div>
          <div className="space-y-1.5"><Label htmlFor="pw">Senha</Label><Input id="pw" type="password" required minLength={6} value={password} onChange={(e) => setPassword(e.target.value)} /></div>
          <Button className="w-full" disabled={busy}>{mode === "in" ? "Entrar" : "Criar conta"}</Button>
        </form>
        <p className="text-center text-sm text-muted-foreground">
          {mode === "in" ? "Não tem conta?" : "Já tem conta?"}{" "}
          <button className="font-medium text-primary underline-offset-4 hover:underline" onClick={() => setMode(mode === "in" ? "up" : "in")}>
            {mode === "in" ? "Cadastre-se" : "Entrar"}
          </button>
        </p>
      </div>
    </div>
  );
}
