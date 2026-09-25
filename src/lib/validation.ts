import { z } from "zod";

export const loginSchema = z.object({
  email: z.string().email("E-mail inválido"),
  password: z.string().min(6, "A senha deve ter no mínimo 6 caracteres"),
});

export const registerSchema = z.object({
  name: z.string().min(2, "Informe seu nome completo"),
  email: z.string().email("E-mail inválido"),
  password: z.string().min(8, "A senha deve ter no mínimo 8 caracteres"),
  phone: z.string().optional(),
});

export const changePasswordSchema = z
  .object({
    currentPassword: z.string().min(6),
    newPassword: z
      .string()
      .min(10, "A nova senha deve ter no mínimo 10 caracteres")
      .regex(/[A-Z]/, "Inclua ao menos uma letra maiúscula")
      .regex(/[0-9]/, "Inclua ao menos um número"),
    confirmPassword: z.string(),
  })
  .refine((data) => data.newPassword === data.confirmPassword, {
    message: "As senhas não coincidem",
    path: ["confirmPassword"],
  });

export const contactSchema = z.object({
  name: z.string().min(2).max(120),
  email: z.string().email(),
  phone: z.string().max(20).optional(),
  subject: z.string().max(150).optional(),
  message: z.string().min(10).max(2000),
});

export const productSchema = z.object({
  name: z.string().min(2).max(180),
  slug: z
    .string()
    .min(2)
    .regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, "Use apenas letras minúsculas, números e hífens"),
  brand: z.string().min(1).max(80),
  model: z.string().min(1).max(80),
  description: z.string().min(10),
  priceCents: z.number().int().positive(),
  salePriceCents: z.number().int().positive().nullable().optional(),
  stock: z.number().int().min(0),
  categoryId: z.string().cuid(),
  weightGrams: z.number().int().positive().nullable().optional(),
  images: z.array(z.string().url()).max(6, "Máximo de 6 fotos por produto.").optional(),
});

export const couponSchema = z.object({
  code: z.string().min(3).max(30).toUpperCase(),
  percentOff: z.number().int().min(1).max(100).optional(),
  amountOffCents: z.number().int().positive().optional(),
  minOrderCents: z.number().int().positive().optional(),
  maxUses: z.number().int().positive().optional(),
  expiresAt: z.coerce.date().optional(),
});
