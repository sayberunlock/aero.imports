import type { MetadataRoute } from "next";
import { siteConfig, mainCategories } from "@/lib/site-config";
import { getAllProducts } from "@/lib/products";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const staticRoutes = [
    "",
    "/produtos",
    "/promocoes",
    "/novidades",
    "/assistencia-tecnica",
    "/empresa",
    "/contato",
    "/faq",
    "/garantia",
    "/politica-de-privacidade",
    "/termos-de-uso",
  ].map((route) => ({
    url: `${siteConfig.url}${route}`,
    lastModified: new Date(),
    changeFrequency: "weekly" as const,
    priority: route === "" ? 1 : 0.7,
  }));

  const categoryRoutes = mainCategories.map((c) => ({
    url: `${siteConfig.url}/${c.slug}`,
    lastModified: new Date(),
    changeFrequency: "weekly" as const,
    priority: 0.8,
  }));

  const products = await getAllProducts();
  const productRoutes = products.map((p) => ({
    url: `${siteConfig.url}/produtos/${p.slug}`,
    lastModified: new Date(),
    changeFrequency: "weekly" as const,
    priority: 0.9,
  }));

  return [...staticRoutes, ...categoryRoutes, ...productRoutes];
}
