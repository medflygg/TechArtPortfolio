import { publicUrl } from "../../../lib/publicUrl";

export const groceryPhotos = {
  hero: publicUrl("portfolio/grocery/hero.jpg"),
  kale: publicUrl("portfolio/grocery/kale.jpg"),
  tomato: publicUrl("portfolio/grocery/tomato.jpg"),
  carrot: publicUrl("portfolio/grocery/carrot.jpg"),
  blueberry: publicUrl("portfolio/grocery/blueberry.jpg"),
  spinach: publicUrl("portfolio/grocery/spinach.jpg"),
  avocado: publicUrl("portfolio/grocery/avocado.jpg"),
  bakery: publicUrl("portfolio/grocery/bakery.jpg"),
  dairy: publicUrl("portfolio/grocery/dairy.jpg"),
  farm: publicUrl("portfolio/grocery/farm.jpg"),
} as const;
