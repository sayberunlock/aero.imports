import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { db } from "@/lib/db";

export async function PATCH(req: Request, { params }: { params: { id: string } }) {
  const session = await getServerSession(authOptions);
  const role = session?.user?.role;
  if (!session || (role !== "ADMIN" && role !== "SUPPORT")) {
    return NextResponse.json({ message: "Não autenticado." }, { status: 401 });
  }

  const body = await req.json().catch(() => ({}));
  const product = await db.product.update({ where: { id: params.id }, data: { isNew: Boolean(body.isNew) } });
  return NextResponse.json({ product });
}
