import { createFileRoute, Link } from "@tanstack/react-router";
import { BookOpen, History, Link2, Palette } from "lucide-react";
import { Button } from "@/components/ui/button";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Atende.ai — Seu chatbot de atendimento com IA" },
      { name: "description", content: "Crie um assistente com IA que conhece seu negócio e atende seus clientes por um link público." },
      { property: "og:title", content: "Atende.ai — Seu chatbot de atendimento com IA" },
      { property: "og:description", content: "Crie um assistente com IA que conhece seu negócio e atende seus clientes por um link público." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: Index,
});

const FEATURES = [
  { icon: Palette, title: "Do seu jeito", text: "Nome, avatar, personalidade e tom de voz que combinam com a sua marca." },
  { icon: BookOpen, title: "Conhece o negócio", text: "Base de conhecimento com perguntas frequentes e regras de atendimento." },
  { icon: History, title: "Histórico por conversa", text: "Clientes retomam conversas, criam novas e apagam o histórico." },
  { icon: Link2, title: "Link público", text: "Compartilhe um link e comece a atender na hora — teste antes no modo de teste." },
];

function Index() {
  return (
    <div className="min-h-dvh bg-background">
      <header className="mx-auto flex max-w-6xl items-center justify-between px-6 py-5">
        <span className="font-display text-2xl">Atende<span className="text-primary">.ai</span></span>
        <Button asChild variant="ghost"><Link to="/entrar">Entrar</Link></Button>
      </header>
      <main className="mx-auto max-w-6xl px-6">
        <section className="grid items-center gap-12 py-16 md:grid-cols-2 md:py-24">
          <div className="space-y-6">
            <p className="inline-block rounded-full bg-accent px-3 py-1 text-sm text-accent-foreground">Atendimento com IA, sem complicação</p>
            <h1 className="font-display text-5xl leading-[1.05] md:text-6xl">Um atendente que nunca dorme — e fala como a sua empresa.</h1>
            <p className="max-w-lg text-lg text-muted-foreground">Configure em minutos, ensine o que importa e compartilhe um link com seus clientes.</p>
            <Button asChild size="lg" className="h-12 px-8 text-base"><Link to="/entrar">Criar meu assistente</Link></Button>
          </div>
          <div className="relative rounded-3xl border border-border bg-card p-6 shadow-soft">
            <div className="mb-5 flex items-center gap-3">
              <div className="flex size-10 items-center justify-center rounded-full bg-accent text-xl">☕</div>
              <div><div className="font-medium">Aurora</div><div className="text-xs text-muted-foreground">Padaria Aurora · online</div></div>
            </div>
            <div className="space-y-4 text-sm">
              <div className="ml-auto w-fit max-w-[80%] rounded-2xl rounded-br-sm bg-primary px-4 py-2 text-primary-foreground">Vocês entregam no Batel?</div>
              <p className="max-w-[90%]">Entregamos sim! 🥐 O Batel fica dentro do nosso raio de 5 km. A taxa é <strong>R$ 6</strong> e o prazo médio é de 40 minutos. Quer ver o cardápio do dia?</p>
              <div className="flex gap-2"><span className="rounded-full border border-border px-3 py-1 text-xs">Ver cardápio</span><span className="rounded-full border border-border px-3 py-1 text-xs">Formas de pagamento</span></div>
            </div>
          </div>
        </section>
        <section className="grid gap-4 pb-24 sm:grid-cols-2 lg:grid-cols-4">
          {FEATURES.map((f) => (
            <div key={f.title} className="rounded-2xl border border-border bg-card p-6">
              <f.icon className="mb-4 size-6 text-primary" />
              <h3 className="font-display text-lg">{f.title}</h3>
              <p className="mt-1 text-sm text-muted-foreground">{f.text}</p>
            </div>
          ))}
        </section>
      </main>
    </div>
  );
}
