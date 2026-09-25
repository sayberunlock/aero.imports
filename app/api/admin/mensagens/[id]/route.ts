import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { db } from "@/lib/db";

export async function PATCH(_req: Request, { params }: { params: { id: string } }) {
  const session = await getServerSession(authOptions);
  const role = session?.user?.role;
  if (!session || (role !== "ADMIN" && role !== "SUPPORT")) {
    return NextResponse.json({ message: "Não autenticado." }, { status: 401 });
  }

  const message = await db.contactMessage.update({ where: { id: params.id }, data: { read: true } });
  return NextResponse.json({ message });
}
