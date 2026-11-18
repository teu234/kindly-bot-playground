export type Tone = "formal" | "descontraido" | "especialista" | "amigavel" | "objetivo";

export const TONES: { value: Tone; label: string; hint: string }[] = [
  { value: "descontraido", label: "Descontraído", hint: "Leve, próximo, com bom humor" },
  { value: "formal", label: "Formal", hint: "Educado, respeitoso, sem gírias" },
  { value: "especialista", label: "Especialista", hint: "Técnico, preciso e detalhado" },
  { value: "amigavel", label: "Acolhedor", hint: "Empático e paciente" },
  { value: "objetivo", label: "Objetivo", hint: "Respostas curtas e diretas" },
];

export type BotConfig = {
  name: string;
  tone: string;
  company_info: string;
  instructions: string;
  knowledge: string;
};

const TONE_TEXT: Record<string, string> = {
  formal: "Use linguagem formal, educada e profissional. Evite gírias e emojis.",
  descontraido: "Use um tom descontraído, leve e próximo, podendo usar emojis com moderação.",
  especialista: "Fale como um especialista: preciso, técnico quando útil, bem estruturado.",
  amigavel: "Seja acolhedor, empático e paciente, validando as necessidades do cliente.",
  objetivo: "Seja objetivo: respostas curtas e diretas, no máximo alguns parágrafos.",
};

export function buildSystemPrompt(bot: BotConfig): string {
  return [
    `Você é ${bot.name || "um assistente virtual"}, assistente de atendimento ao cliente.`,
    TONE_TEXT[bot.tone] ?? TONE_TEXT['descontraido'],
    "Responda no idioma do cliente (padrão: português do Brasil). Use markdown quando ajudar (listas, negrito).",
    "Baseie-se nas informações abaixo. Se não souber algo, diga com honestidade e ofereça encaminhar para um atendente humano. Nunca invente preços, prazos ou políticas.",
    bot.company_info.trim() && `## Sobre a empresa\n${bot.company_info.trim()}`,
    bot.knowledge.trim() && `## Base de conhecimento (FAQ, regras e contexto)\n${bot.knowledge.trim()}`,
    bot.instructions.trim() && `## Instruções do dono\n${bot.instructions.trim()}`,
  ]
    .filter(Boolean)
    .join("\n\n");
}
