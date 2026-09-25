import type { Metadata } from "next";
import { CategoryPage } from "@/components/categoria/CategoryPage";

export const metadata: Metadata = {
  title: "Acessórios",
  description: "Confira nossa linha de Acessórios DJI originais, com nota fiscal e garantia. Loja autorizada Aero Imports.",
};

export default function AcessoriosPage() {
  return <CategoryPage slug="acessorios" label="Acessórios" />;
}
