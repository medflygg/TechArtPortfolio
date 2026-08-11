import { publicUrl } from "../../../lib/publicUrl";

/** Local kiln workshop photos under public/portfolio/kiln. */
export const kilnPhotos = {
  workshop: publicUrl("portfolio/kiln/workshop.jpg"),
  copper: publicUrl("portfolio/kiln/copper.jpg"),
  tools: publicUrl("portfolio/kiln/tools.jpg"),
  texture: publicUrl("portfolio/kiln/texture.jpg"),
  portrait: publicUrl("portfolio/kiln/portrait.jpg"),
  pottery: publicUrl("portfolio/kiln/pottery.jpg"),
} as const;
