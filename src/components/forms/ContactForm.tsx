"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { contactSchema } from "@/lib/validation";
import type { z } from "zod";

type FormData = z.infer<typeof contactSchema>;

export function ContactForm() {
  const [status, setStatus] = useState<"idle" | "success" | "error">("idle");
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<FormData>({ resolver: zodResolver(contactSchema) });

  async function onSubmit(data: FormData) {
    setStatus("idle");
    const res = await fetch("/api/contato", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });

    if (res.ok) {
      setStatus("success");
      reset();
    } else {
      setStatus("error");
    }
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <Field label="Nome" error={errors.name?.message}>
        <input {...register("name")} className="input" />
      </Field>
      <Field label="E-mail" error={errors.email?.message}>
        <input type="email" {...register("email")} className="input" />
      </Field>
      <Field label="Telefone (opcional)" error={errors.phone?.message}>
        <input {...register("phone")} className="input" />
      </Field>
      <Field label="Assunto (opcional)" error={errors.subject?.message}>
        <input {...register("subject")} className="input" />
      </Field>
      <Field label="Mensagem" error={errors.message?.message}>
        <textarea rows={5} {...register("message")} className="input resize-none" />
      </Field>

      {status === "success" && (
        <p className="text-sm text-emerald-600">Mensagem enviada! Responderemos em breve.</p>
      )}
      {status === "error" && (
        <p className="text-sm text-red-600">Não foi possível enviar. Tente novamente.</p>
      )}

      <button
        type="submit"
        disabled={isSubmitting}
        className="w-full rounded-full bg-aero py-3.5 text-sm font-medium text-cloud transition-opacity hover:opacity-90 disabled:opacity-60 sm:w-auto sm:px-8"
      >
        {isSubmitting ? "Enviando…" : "Enviar mensagem"}
      </button>

      <style jsx>{`
        .input {
          width: 100%;
          border: 1px solid theme("colors.fog");
          border-radius: 0.5rem;
          padding: 0.65rem 0.9rem;
          font-size: 0.875rem;
          outline: none;
        }
        .input:focus {
          border-color: theme("colors.signal.DEFAULT");
        }
      `}</style>
    </form>
  );
}

function Field({
  label,
  error,
  children,
}: {
  label: string;
  error?: string;
  children: React.ReactNode;
}) {
  return (
    <div>
      <label className="mb-1.5 block text-xs font-medium text-steel">{label}</label>
      {children}
      {error && <p className="mt-1 text-xs text-red-600">{error}</p>}
    </div>
  );
}
