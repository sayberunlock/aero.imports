import type { Metadata } from "next";
import { CategoryPage } from "@/components/categoria/CategoryPage";

export const metadata: Metadata = {
  title: "Estabilizadores",
  description: "Confira nossa linha de Estabilizadores DJI originais, com nota fiscal e garantia. Loja autorizada Aero Imports.",
};

export default function EstabilizadoresPage() {
  return <CategoryPage slug="estabilizadores" label="Estabilizadores" />;
}
