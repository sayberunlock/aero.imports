"use client";

import { useMemo, useState } from "react";
import { SlidersHorizontal } from "lucide-react";
import { ProductCard } from "@/components/produto/ProductCard";
import type { ProductSummary } from "@/lib/types";

type Category = { slug: string; label: string };

export function ProductFilters({
  products,
  categories,
}: {
  products: ProductSummary[];
  categories: readonly Category[];
}) {
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [onlyInStock, setOnlyInStock] = useState(false);
  const [onlyOnSale, setOnlyOnSale] = useState(false);
  const [onlyNew, setOnlyNew] = useState(false);

  function toggleCategory(slug: string) {
    setSelectedCategories((prev) => (prev.includes(slug) ? prev.filter((s) => s !== slug) : [...prev, slug]));
  }

  const filtered = useMemo(() => {
    return products.filter((p) => {
      if (selectedCategories.length > 0 && !selectedCategories.includes(p.categorySlug)) return false;
      if (onlyInStock && p.badge === "Esgotado") return false;
      if (onlyOnSale && p.badge !== "Promoção") return false;
      if (onlyNew && p.badge !== "Novo") return false;
      return true;
    });
  }, [products, selectedCategories, onlyInStock, onlyOnSale, onlyNew]);

  return (
    <div className="flex flex-col gap-8 lg:flex-row">
      <aside className="w-full shrink-0 lg:w-64">
        <div className="flex items-center gap-2 border-b border-fog pb-4 text-sm font-medium text-ink">
          <SlidersHorizontal size={16} />
          Filtros
        </div>

        <FilterGroup title="Categoria">
          {categories.map((c) => (
            <FilterCheckbox
              key={c.slug}
              label={c.label}
              checked={selectedCategories.includes(c.slug)}
              onChange={() => toggleCategory(c.slug)}
            />
          ))}
        </FilterGroup>

        <FilterGroup title="Disponibilidade">
          <FilterCheckbox label="Em estoque" checked={onlyInStock} onChange={() => setOnlyInStock((v) => !v)} />
        </FilterGroup>

        <FilterGroup title="Destaques">
          <FilterCheckbox label="Promoção" checked={onlyOnSale} onChange={() => setOnlyOnSale((v) => !v)} />
          <FilterCheckbox label="Lançamentos" checked={onlyNew} onChange={() => setOnlyNew((v) => !v)} />
        </FilterGroup>
      </aside>

      <div className="flex-1">
        <div className="mb-6 flex items-center justify-between text-sm text-steel">
          <span>{filtered.length} produto{filtered.length === 1 ? "" : "s"}</span>
        </div>
        {filtered.length === 0 ? (
          <p className="rounded-xl border border-dashed border-steel-light bg-fog/60 px-6 py-16 text-center text-sm text-steel">
            Nenhum produto encontrado com esses filtros.
          </p>
        ) : (
          <div className="grid grid-cols-2 gap-5 sm:grid-cols-3 lg:grid-cols-4">
            {filtered.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

function FilterGroup({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="border-b border-fog py-5">
      <p className="mb-3 text-xs font-semibold uppercase tracking-wide text-ink">{title}</p>
      <div className="space-y-2">{children}</div>
    </div>
  );
}

function FilterCheckbox({
  label,
  checked,
  onChange,
}: {
  label: string;
  checked: boolean;
  onChange: () => void;
}) {
  return (
    <label className="flex items-center gap-2 text-sm text-steel">
      <input
        type="checkbox"
        checked={checked}
        onChange={onChange}
        className="h-4 w-4 rounded border-fog text-signal focus:ring-signal"
      />
      {label}
    </label>
  );
}
