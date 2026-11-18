import { useQuery, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import type { Tables, TablesUpdate } from "@/integrations/supabase/types";

export type Bot = Tables<"bots">;

export function useMyBot(userId: string | undefined) {
  const qc = useQueryClient();
  const query = useQuery({
    queryKey: ["my-bot", userId],
    enabled: !!userId,
    queryFn: async (): Promise<Bot> => {
      const { data, error } = await supabase.from("bots").select("*").order("created_at").limit(1).maybeSingle();
      if (error) throw error;
      if (data) return data;
      const { data: created, error: e2 } = await supabase.from("bots").insert({ owner_id: userId! }).select().single();
      if (e2) throw e2;
      return created;
    },
  });
  const save = async (id: string, patch: TablesUpdate<"bots">) => {
    const { data, error } = await supabase
      .from("bots")
      .update({ ...patch, updated_at: new Date().toISOString() })
      .eq("id", id)
      .select()
      .single();
    if (error) throw error;
    qc.setQueryData(["my-bot", userId], data);
    return data;
  };
  return { ...query, save };
}
