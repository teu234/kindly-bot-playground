import { createServerFn } from "@tanstack/react-start";

export type PublicBot = {
  id: string;
  name: string;
  avatar: string;
  welcome: string;
  suggestions: string[];
  is_public: boolean;
};

export const getPublicBot = createServerFn({ method: "GET" })
  .inputValidator((d: { botId: string }) => {
    if (!/^[0-9a-f-]{36}$/i.test(d.botId)) throw new Error("invalid");
    return d;
  })
  .handler(async ({ data }): Promise<PublicBot | null> => {
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
    const { data: bot } = await supabaseAdmin
      .from("bots")
      .select("id,name,avatar,welcome,suggestions,is_public")
      .eq("id", data.botId)
      .maybeSingle();
    return bot ?? null;
  });
