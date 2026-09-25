import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { db } from "@/lib/db";

export async function DELETE(_req: Request, { params }: { params: { id: string } }) {
  const session = await getServerSession(authOptions);
  const role = session?.user?.role;
  if (!session || (role !== "ADMIN" && role !== "SUPPORT")) {
    return NextResponse.json({ message: "Não autenticado." }, { status: 401 });
  }

  await db.teamMember.delete({ where: { id: params.id } });
  return NextResponse.json({ ok: true });
}
