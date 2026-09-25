"use client";

import { useState } from "react";
import { ChevronDown } from "lucide-react";

type FaqItem = { question: string; answer: string };

export function FaqAccordion({ items }: { items: FaqItem[] }) {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  return (
    <div className="divide-y divide-fog rounded-2xl border border-fog bg-cloud">
      {items.map((item, i) => {
        const isOpen = openIndex === i;
        return (
          <div key={item.question}>
            <button
              onClick={() => setOpenIndex(isOpen ? null : i)}
              aria-expanded={isOpen}
              className="flex w-full items-center justify-between gap-4 px-6 py-5 text-left"
            >
              <span className="font-medium text-ink">{item.question}</span>
              <ChevronDown
                size={18}
                className={`shrink-0 text-steel transition-transform duration-300 ${isOpen ? "rotate-180" : ""}`}
              />
            </button>
            <div
              className="grid overflow-hidden transition-all duration-300 ease-aero"
              style={{ gridTemplateRows: isOpen ? "1fr" : "0fr" }}
            >
              <div className="overflow-hidden">
                <p className="px-6 pb-5 text-sm leading-relaxed text-steel">{item.answer}</p>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
