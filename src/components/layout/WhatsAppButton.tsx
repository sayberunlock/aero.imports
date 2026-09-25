"use client";

import { MessageCircle } from "lucide-react";
import { motion } from "framer-motion";
import { siteConfig } from "@/lib/site-config";

export function WhatsAppButton({
  message,
  whatsappNumber,
}: {
  message?: string;
  /** Número resolvido via `getSiteConfig()` (SiteSetting > fallback estático). */
  whatsappNumber?: string;
}) {
  const defaultMessage =
    message ?? "Olá! Vim pelo site da Aero Imports e gostaria de mais informações sobre os produtos DJI.";
  const href = `https://wa.me/${whatsappNumber ?? siteConfig.whatsapp}?text=${encodeURIComponent(defaultMessage)}`;

  return (
    <motion.a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      aria-label="Fale com a Aero Imports no WhatsApp"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.6, duration: 0.5 }}
      whileHover={{ scale: 1.06 }}
      whileTap={{ scale: 0.96 }}
      className="fixed bottom-6 right-6 z-50 flex h-14 w-14 items-center justify-center rounded-full bg-[#25D366] text-white shadow-elevate"
    >
      <MessageCircle size={26} strokeWidth={1.8} fill="white" className="text-[#25D366]" />
      <span className="sr-only">Falar no WhatsApp</span>
    </motion.a>
  );
}
