"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { CldUploadWidget, type CloudinaryUploadWidgetResults } from "next-cloudinary";
import { formatBRL } from "@/lib/utils";

type Category = { id: string; name: string };

export type ProductFormValues = {
  id?: string;
  name: string;
  slug: string;
  brand: string;
  model: string;
  description: string;
  priceCents: number;
  salePriceCents?: number | null;
  stock: number;
  categoryId: string;
  weightGrams?: number | null;
  images: string[];
};

const MAX_PRODUCT_IMAGES = 6;

// Converte centavos para o texto que aparece no campo (ex.: 150000 -> "1500,00").
function centsToInputText(cents: number | null | undefined) {
  if (!cents) return "";
  return (cents / 100).toFixed(2).replace(".", ",");
}

// Converte o texto digitado pelo usuário (aceita "," ou ".") de volta para centavos.
function inputTextToCents(text: string): number {
  const normalized = text.replace(/\./g, "").replace(",", ".");
  const value = parseFloat(normalized);
  return Number.isFinite(value) ? Math.round(value * 100) : 0;
}

function slugify(text: string) {
  return text
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}

export function ProductForm({
  categories,
  initial,
}: {
  categories: Category[];
  initial?: ProductFormValues;
}) {
  const router = useRouter();
  const isEditing = Boolean(initial?.id);

  const [values, setValues] = useState<ProductFormValues>(
    initial ?? {
      name: "",
      slug: "",
      brand: "",
      model: "",
      description: "",
      priceCents: 0,
      salePriceCents: null,
      stock: 0,
      categoryId: categories[0]?.id ?? "",
      weightGrams: null,
      images: [],
    }
  );
  const [slugTouched, setSlugTouched] = useState(isEditing);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Texto "solto" dos campos de preço — não é reformatado a cada tecla,
  // só quando o campo perde o foco. Isso evita o cursor pular enquanto
  // o usuário digita (ex.: tentar digitar "1500" e o campo virar "0,01",
  // "0,15", "1,50"... a cada dígito).
  const [priceText, setPriceText] = useState(centsToInputText(initial?.priceCents));
  const [salePriceText, setSalePriceText] = useState(centsToInputText(initial?.salePriceCents));

  function handleNameChange(name: string) {
    setValues((v) => ({
      ...v,
      name,
      slug: slugTouched ? v.slug : slugify(name),
    }));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSubmitting(true);
    setError(null);

    const endpoint = isEditing ? `/api/admin/produtos/${initial!.id}` : "/api/admin/produtos";
    const method = isEditing ? "PATCH" : "POST";

    const res = await fetch(endpoint, {
      method,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(values),
    });

    setSubmitting(false);

    if (!res.ok) {
      const data = await res.json().catch(() => null);
      setError(data?.message ?? "Não foi possível salvar o produto.");
      return;
    }

    router.push("/admin/produtos");
    router.refresh();
  }

  async function handleDelete() {
    if (!initial?.id) return;
    if (!confirm(`Excluir "${initial.name}"? Essa ação não pode ser desfeita.`)) return;

    const res = await fetch(`/api/admin/produtos/${initial.id}`, { method: "DELETE" });
    if (!res.ok) {
      const data = await res.json().catch(() => null);
      setError(data?.message ?? "Não foi possível excluir o produto.");
      return;
    }

    router.push("/admin/produtos");
    router.refresh();
  }

  return (
    <form onSubmit={handleSubmit} className="max-w-2xl space-y-5">
      {error && (
        <p className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
          {error}
        </p>
      )}

      <Field label="Nome do produto">
        <input
          required
          value={values.name}
          onChange={(e) => handleNameChange(e.target.value)}
          className="input"
        />
      </Field>

      <Field label="Slug (URL)" hint="Gerado automaticamente a partir do nome, mas pode editar.">
        <input
          required
          value={values.slug}
          onChange={(e) => {
            setSlugTouched(true);
            setValues((v) => ({ ...v, slug: e.target.value }));
          }}
          className="input font-mono text-xs"
        />
      </Field>

      <div className="grid grid-cols-2 gap-4">
        <Field label="Marca">
          <input
            required
            value={values.brand}
            onChange={(e) => setValues((v) => ({ ...v, brand: e.target.value }))}
            className="input"
          />
        </Field>
        <Field label="Modelo">
          <input
            required
            value={values.model}
            onChange={(e) => setValues((v) => ({ ...v, model: e.target.value }))}
            className="input"
          />
        </Field>
      </div>

      <Field label="Categoria">
        <select
          required
          value={values.categoryId}
          onChange={(e) => setValues((v) => ({ ...v, categoryId: e.target.value }))}
          className="input"
        >
          {categories.length === 0 && <option value="">Nenhuma categoria cadastrada</option>}
          {categories.map((c) => (
            <option key={c.id} value={c.id}>
              {c.name}
            </option>
          ))}
        </select>
      </Field>

      <Field label="Descrição">
        <textarea
          required
          rows={5}
          value={values.description}
          onChange={(e) => setValues((v) => ({ ...v, description: e.target.value }))}
          className="input"
        />
      </Field>

      <div className="grid grid-cols-2 gap-4">
        <Field label="Preço (R$)" hint={values.priceCents ? formatBRL(values.priceCents) : undefined}>
          <input
            required
            type="text"
            inputMode="decimal"
            placeholder="0,00"
            value={priceText}
            onChange={(e) => {
              // Permite só números, vírgula e ponto enquanto digita.
              const cleaned = e.target.value.replace(/[^0-9.,]/g, "");
              setPriceText(cleaned);
              setValues((v) => ({ ...v, priceCents: inputTextToCents(cleaned) }));
            }}
            onBlur={() => setPriceText(centsToInputText(values.priceCents))}
            className="input"
          />
        </Field>
        <Field
          label="Preço promocional (R$)"
          hint="Deixe vazio se não houver promoção."
        >
          <input
            type="text"
            inputMode="decimal"
            placeholder="0,00"
            value={salePriceText}
            onChange={(e) => {
              const cleaned = e.target.value.replace(/[^0-9.,]/g, "");
              setSalePriceText(cleaned);
              setValues((v) => ({
                ...v,
                salePriceCents: cleaned ? inputTextToCents(cleaned) : null,
              }));
            }}
            onBlur={() => setSalePriceText(centsToInputText(values.salePriceCents))}
            className="input"
          />
        </Field>
      </div>

      <Field label="Estoque (unidades)">
        <input
          required
          type="number"
          min={0}
          value={values.stock}
          onChange={(e) => setValues((v) => ({ ...v, stock: parseInt(e.target.value || "0", 10) }))}
          className="input"
        />
      </Field>

      <Field
        label="Fotos do produto"
        hint={`Envie até ${MAX_PRODUCT_IMAGES} fotos (JPG, PNG ou WEBP). A primeira foto da lista é a que aparece na vitrine da loja.`}
      >
        <div className="flex items-center gap-3">
          <CldUploadWidget
            uploadPreset={process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET}
            options={{
              cloudName: process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME,
              sources: ["local", "camera"],
              multiple: true,
              maxFiles: MAX_PRODUCT_IMAGES,
              clientAllowedFormats: ["jpg", "jpeg", "png", "webp"],
              maxFileSize: 8_000_000,
              language: "pt",
              text: {
                pt: {
                  local: { browse: "Escolher do computador", dd_title_multiple: "Arraste as fotos aqui" },
                },
              },
            }}
            onSuccess={(result: CloudinaryUploadWidgetResults) => {
              const info = result.info;
              if (info && typeof info === "object" && "secure_url" in info) {
                setValues((v) =>
                  v.images.length >= MAX_PRODUCT_IMAGES
                    ? v
                    : { ...v, images: [...v.images, info.secure_url as string] }
                );
              }
            }}
          >
            {({ open }) => (
              <button
                type="button"
                disabled={values.images.length >= MAX_PRODUCT_IMAGES}
                onClick={() => open()}
                className="rounded-full border border-fog bg-white px-5 py-2.5 text-sm font-medium text-ink transition-colors hover:bg-fog disabled:cursor-not-allowed disabled:opacity-50"
              >
                {values.images.length >= MAX_PRODUCT_IMAGES
                  ? "Limite de fotos atingido"
                  : values.images.length > 0
                  ? "Adicionar mais fotos"
                  : "Enviar fotos"}
              </button>
            )}
          </CldUploadWidget>
          <span className="text-xs text-steel">
            {values.images.length} de {MAX_PRODUCT_IMAGES}
          </span>
        </div>
      </Field>

      {values.images.length > 0 && (
        <div className="flex flex-wrap gap-3">
          {values.images.map((url, i) => (
            <div key={url + i} className="relative">
              <img
                src={url}
                alt={`Foto ${i + 1}`}
                className="h-28 w-28 rounded-lg border border-fog object-cover"
              />
              {i === 0 && (
                <span className="absolute left-1 top-1 rounded-full bg-ink/80 px-2 py-0.5 text-[10px] font-medium text-cloud">
                  Principal
                </span>
              )}
              <div className="absolute -right-1.5 -top-1.5 flex gap-1">
                {i > 0 && (
                  <button
                    type="button"
                    title="Mover para posição anterior"
                    onClick={() =>
                      setValues((v) => {
                        const images = [...v.images];
                        [images[i - 1], images[i]] = [images[i], images[i - 1]];
                        return { ...v, images };
                      })
                    }
                    className="flex h-6 w-6 items-center justify-center rounded-full border border-fog bg-white text-xs text-ink shadow-sm hover:bg-fog"
                  >
                    ←
                  </button>
                )}
                <button
                  type="button"
                  title="Remover foto"
                  onClick={() =>
                    setValues((v) => ({ ...v, images: v.images.filter((_, idx) => idx !== i) }))
                  }
                  className="flex h-6 w-6 items-center justify-center rounded-full border border-red-200 bg-white text-xs text-red-600 shadow-sm hover:bg-red-50"
                >
                  ×
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      <div className="flex items-center gap-3 pt-2">
        <button
          type="submit"
          disabled={submitting}
          className="rounded-full bg-aero px-6 py-2.5 text-sm font-medium text-cloud transition-opacity hover:opacity-90 disabled:opacity-60"
        >
          {submitting ? "Salvando…" : isEditing ? "Salvar alterações" : "Cadastrar produto"}
        </button>
        {isEditing && (
          <button
            type="button"
            onClick={handleDelete}
            className="rounded-full border border-red-200 px-6 py-2.5 text-sm font-medium text-red-600 transition-colors hover:bg-red-50"
          >
            Excluir produto
          </button>
        )}
      </div>

      <style jsx global>{`
        .input {
          width: 100%;
          border: 1px solid #e7e9ec;
          border-radius: 0.65rem;
          padding: 0.6rem 0.85rem;
          font-size: 0.875rem;
          background: white;
          outline: none;
        }
        .input:focus {
          border-color: #2c7be0;
        }
      `}</style>
    </form>
  );
}

function Field({
  label,
  hint,
  children,
}: {
  label: string;
  hint?: string;
  children: React.ReactNode;
}) {
  return (
    <label className="block">
      <span className="mb-1.5 block text-xs font-medium text-steel">{label}</span>
      {children}
      {hint && <span className="mt-1 block text-xs text-steel">{hint}</span>}
    </label>
  );
}
