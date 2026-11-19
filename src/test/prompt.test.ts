import { describe, expect, it } from "vitest";
import { buildSystemPrompt } from "@/lib/prompt";

const base = { name: "Aurora", tone: "formal", company_info: "Padaria Aurora", instructions: "Ofereça o cardápio", knowledge: "Taxa R$ 6" };

describe("buildSystemPrompt", () => {
  it("includes bot name, company, knowledge and owner instructions", () => {
    const p = buildSystemPrompt(base);
    for (const s of ["Aurora", "Padaria Aurora", "Taxa R$ 6", "Ofereça o cardápio"]) expect(p).toContain(s);
  });
  it("applies the formal tone", () => {
    expect(buildSystemPrompt(base)).toContain("linguagem formal");
  });
});
