import { createFileRoute, Link, Outlet, useNavigate } from "@tanstack/react-router";
import { useEffect } from "react";
import { LogOut } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/hooks/use-auth";
import { supabase } from "@/integrations/supabase/client";

export const Route = createFileRoute("/painel")({
  head: () => ({
    meta: [
      { title: "Painel — Atende.ai" },
      { name: "description", content: "Personalize seu assistente de atendimento com IA." },
      { property: "og:title", content: "Painel — Atende.ai" },
      { property: "og:description", content: "Personalize seu assistente de atendimento com IA." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
    ],
  }),
  component: PainelLayout,
});

function PainelLayout() {
  const { user, loading } = useAuth();
  const navigate = useNavigate();
  useEffect(() => {
    if (!loading && !user) navigate({ to: "/entrar" });
  }, [loading, user, navigate]);
  if (!user) return <div className="flex h-dvh items-center justify-center text-muted-foreground">Carregando...</div>;
  return (
    <div className="flex h-dvh flex-col">
      <header className="flex items-center gap-4 border-b border-border bg-card px-4 py-3">
        <Link to="/" className="font-display text-xl">Atende<span className="text-primary">.ai</span></Link>
        <nav className="flex gap-1 text-sm">
          <Link to="/painel" activeOptions={{ exact: true }} className="rounded-md px-3 py-1.5 hover:bg-muted" activeProps={{ className: "bg-muted font-medium" }}>
            Personalizar
          </Link>
          <Link to="/painel/teste" className="rounded-md px-3 py-1.5 hover:bg-muted" activeProps={{ className: "bg-muted font-medium" }}>
            Modo de teste
          </Link>
        </nav>
        <Button variant="ghost" size="sm" className="ml-auto" onClick={() => supabase.auth.signOut()}>
          <LogOut /> <span className="hidden sm:inline">Sair</span>
        </Button>
      </header>
      <div className="min-h-0 flex-1">
        <Outlet />
      </div>
    </div>
  );
}
