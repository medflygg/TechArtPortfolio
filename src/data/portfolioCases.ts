import { publicUrl } from "../lib/publicUrl";

export type PortfolioAudience =
  | "ecommerce"
  | "portfolio"
  | "crm"
  | "grocery"
  | "atelier";

export type PortfolioSlide =
  | { kind: "image"; src: string; label: string }
  | { kind: "mock"; mock: string; label: string };

export type PortfolioCase = {
  id: string;
  audience: PortfolioAudience;
  accent: string;
  theme: "light" | "warm" | "dark" | "playful" | "corporate";
  view: "carousel" | "living";
  livingId?: string;
  slides?: PortfolioSlide[];
  cover: string;
};

/** Same order as Web → Full websites (Kiln #3, NordPulse last). */
export const portfolioCases: PortfolioCase[] = [
  {
    id: "mochalki",
    audience: "ecommerce",
    accent: "#c4a574",
    theme: "warm",
    view: "carousel",
    cover: publicUrl("portfolio/mochalki/products/hero.jpg"),
    slides: [
      { kind: "image", src: publicUrl("portfolio/mochalki/products/hero.jpg"), label: "Home" },
      { kind: "image", src: publicUrl("portfolio/mochalki/products/body.jpg"), label: "Body" },
      { kind: "image", src: publicUrl("portfolio/mochalki/products/mitt.jpg"), label: "Mitt" },
      { kind: "image", src: publicUrl("portfolio/mochalki/products/face.jpg"), label: "Face" },
    ],
  },
  {
    id: "yy-portfolio",
    audience: "portfolio",
    accent: "#111111",
    theme: "light",
    view: "carousel",
    cover: publicUrl("portfolio/saitik/01-home.png"),
    slides: [
      { kind: "image", src: publicUrl("portfolio/saitik/01-home.png"), label: "Home" },
      { kind: "image", src: publicUrl("portfolio/saitik/02-projects.png"), label: "Projects" },
      { kind: "image", src: publicUrl("portfolio/saitik/03-project.png"), label: "Case" },
      { kind: "image", src: publicUrl("portfolio/saitik/04-about.png"), label: "About" },
      { kind: "image", src: publicUrl("portfolio/saitik/05-contacts.png"), label: "Contacts" },
    ],
  },
  {
    id: "kiln-identity",
    audience: "atelier",
    accent: "#e8c07a",
    theme: "warm",
    view: "living",
    livingId: "kiln-identity",
    cover: publicUrl("portfolio/kiln/art/vessel.png"),
  },
  {
    id: "greenbasket",
    audience: "grocery",
    accent: "#16a34a",
    theme: "light",
    view: "living",
    livingId: "greenbasket",
    cover: "living:greenbasket",
  },
  {
    id: "nordpulse",
    audience: "crm",
    accent: "#2563eb",
    theme: "corporate",
    view: "living",
    livingId: "nordpulse",
    cover: "living:nordpulse",
  },
];

export function getPortfolioCase(id: string) {
  return portfolioCases.find((c) => c.id === id) ?? null;
}
