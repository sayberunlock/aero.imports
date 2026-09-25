import { redirect } from "next/navigation";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

export default async function ContaIndexPage() {
  const session = await getServerSession(authOptions);
  redirect(session?.user ? "/conta/perfil" : "/conta/login");
}
