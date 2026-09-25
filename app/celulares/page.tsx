import type { Metadata } from "next";
import { CategoryPage } from "@/components/categoria/CategoryPage";

export const metadata: Metadata = {
  title: "Celulares",
  description: "Confira nossa linha de Celulares DJI originais, com nota fiscal e garantia. Loja autorizada Aero Imports.",
};

export default function CelularesPage() {
  return <CategoryPage slug="celulares" label="Celulares" />;
}
