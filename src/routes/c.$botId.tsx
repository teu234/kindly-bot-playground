import { createFileRoute, notFound, Outlet } from "@tanstack/react-router";
import { getPublicBot } from "@/lib/bots.functions";

export const Route = createFileRoute("/c/$botId")({
  loader: async ({ params }) => {
    const bot = await getPublicBot({ data: { botId: params.botId } }).catch(() => null);
    if (!bot) throw notFound();
    return { bot };
  },
  head: ({ loaderData }) => {
    const name = loaderData?.bot.name ?? "Atendimento";
    const desc = `Converse com ${name}, o assistente virtual de atendimento.`;
    return {
      meta: [
        { title: `${name} — Atendimento` },
        { name: "description", content: desc },
        { property: "og:title", content: `${name} — Atendimento` },
        { property: "og:description", content: desc },
        { property: "og:type", content: "website" },
        { name: "twitter:card", content: "summary" },
      ],
    };
  },
  component: () => <Outlet />,
});
