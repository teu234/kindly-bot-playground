CREATE TABLE public.bots (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  owner_id uuid NOT NULL,
  name text NOT NULL DEFAULT 'Assistente',
  avatar text NOT NULL DEFAULT '🤖',
  tone text NOT NULL DEFAULT 'descontraido',
  company_info text NOT NULL DEFAULT '',
  instructions text NOT NULL DEFAULT '',
  knowledge text NOT NULL DEFAULT '',
  welcome text NOT NULL DEFAULT 'Olá! Como posso ajudar?',
  suggestions text[] NOT NULL DEFAULT ARRAY['Quais são os horários de atendimento?','Como funciona a entrega?','Fale com um atendente']::text[],
  is_public boolean NOT NULL DEFAULT true,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT, INSERT, UPDATE, DELETE ON public.bots TO authenticated;
GRANT ALL ON public.bots TO service_role;
ALTER TABLE public.bots ENABLE ROW LEVEL SECURITY;
CREATE POLICY "own select" ON public.bots FOR SELECT TO authenticated USING (owner_id = auth.uid());
CREATE POLICY "own insert" ON public.bots FOR INSERT TO authenticated WITH CHECK (owner_id = auth.uid());
CREATE POLICY "own update" ON public.bots FOR UPDATE TO authenticated USING (owner_id = auth.uid()) WITH CHECK (owner_id = auth.uid());
CREATE POLICY "own delete" ON public.bots FOR DELETE TO authenticated USING (owner_id = auth.uid());