import { NextResponse } from "next/server";
import { searchProducts } from "@/lib/products";

export const dynamic = "force-dynamic";

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const q = (searchParams.get("q") ?? "").slice(0, 100);

  if (q.trim().length < 2) {
    return NextResponse.json({ products: [] });
  }

  const results = await searchProducts(q);

  return NextResponse.json({ products: results.slice(0, 6), total: results.length });
}
