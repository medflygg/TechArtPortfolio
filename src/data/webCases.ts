export type WebCategoryId = "holo" | "launch";

export type WebCaseKind = "living" | "carousel";

export type WebCaseMeta = {
  id: string;
  category: WebCategoryId;
  accent: string;
  kind: WebCaseKind;
  livingId?: string;
  portfolioId?: string;
  /**
   * Prefer a dedicated edge-to-edge /fullscreen route from the case bar.
   * Defaults to true for living cases; set false to hide the control.
   */
  fullscreen?: boolean;
};

export const webCategories: {
  id: WebCategoryId;
  visual: "holo-ui" | "launch-sites";
}[] = [
  { id: "launch", visual: "launch-sites" },
  { id: "holo", visual: "holo-ui" },
];

/** Full websites order: Vesper → Kiln → Supracor → Shikhovo → … → NordPulse last */
export const webCases: WebCaseMeta[] = [
  {
    id: "aurora-flute",
    category: "holo",
    accent: "#c4a8ff",
    kind: "living",
  },
  {
    id: "mirage-deck",
    category: "holo",
    accent: "#7ec8f0",
    kind: "living",
  },
  {
    id: "prism-controls",
    category: "holo",
    accent: "#f0a8e8",
    kind: "living",
  },
  {
    id: "vesper",
    category: "launch",
    accent: "#c9a36a",
    kind: "living",
  },
  {
    id: "ether",
    category: "launch",
    accent: "#6B4EFF",
    kind: "living",
  },
  {
    id: "audi-rs5",
    category: "launch",
    accent: "#D7B98F",
    kind: "living",
  },
  {
    id: "kiln-site",
    category: "launch",
    accent: "#e8c07a",
    kind: "living",
    livingId: "kiln-identity",
  },
  {
    id: "mochalki",
    category: "launch",
    accent: "#b8955a",
    kind: "living",
  },
  {
    id: "shikhovo",
    category: "launch",
    accent: "#2f9e6b",
    kind: "living",
  },
  {
    id: "yy-portfolio",
    category: "launch",
    accent: "#111111",
    kind: "carousel",
    portfolioId: "yy-portfolio",
  },
  {
    id: "greenbasket",
    category: "launch",
    accent: "#16a34a",
    kind: "living",
  },
  {
    id: "nordpulse",
    category: "launch",
    accent: "#2563eb",
    kind: "living",
  },
];

export function getWebCategory(id: string) {
  if (id === "brand") return null;
  return webCategories.find((c) => c.id === id) ?? null;
}

export function getWebCase(id: string) {
  const c = webCases.find((x) => x.id === id) ?? null;
  if (c?.hidden) return null;
  return c;
}

export function casesForCategory(category: WebCategoryId) {
  return webCases.filter((c) => c.category === category && !c.hidden);
}
