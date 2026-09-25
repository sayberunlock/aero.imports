import type { Metadata } from "next";
import { CategoryPage } from "@/components/categoria/CategoryPage";

export const metadata: Metadata = {
  title: "Câmeras",
  description: "Confira nossa linha de Câmeras DJI originais, com nota fiscal e garantia. Loja autorizada Aero Imports.",
};

export default function CamerasPage() {
  return <CategoryPage slug="cameras" label="Câmeras" />;
}
