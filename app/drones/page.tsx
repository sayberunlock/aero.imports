import type { Metadata } from "next";
import { CategoryPage } from "@/components/categoria/CategoryPage";

export const metadata: Metadata = {
  title: "Drones",
  description: "Confira nossa linha de Drones DJI originais, com nota fiscal e garantia. Loja autorizada Aero Imports.",
};

export default function DronesPage() {
  return <CategoryPage slug="drones" label="Drones" />;
}
