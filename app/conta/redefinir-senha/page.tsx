"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

/**
 * Esta página existia para o antigo fluxo de redefinição por link (token na
 * URL). O fluxo atual usa um código de 6 dígitos, tratado inteiramente em
 * /conta/recuperar-senha. Mantemos esta rota só para não quebrar um link
 * antigo que alguém ainda tenha salvo, redirecionando para o fluxo novo.
 */
export default function RedefinirSenhaRedirectPage() {
  const router = useRouter();

  useEffect(() => {
    router.replace("/conta/recuperar-senha");
  }, [router]);

  return null;
}
