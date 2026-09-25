import type { Metadata } from "next";
import { CategoryPage } from "@/components/categoria/CategoryPage";

export const metadata: Metadata = {
  title: "Microfones",
  description: "Confira nossa linha de Microfones DJI originais, com nota fiscal e garantia. Loja autorizada Aero Imports.",
};

export default function MicrofonesPage() {
  return <CategoryPage slug="microfones" label="Microfones" />;
}
