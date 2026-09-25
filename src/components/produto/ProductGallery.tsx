"use client";

import { useState } from "react";
import Image from "next/image";
import { ChevronLeft, ChevronRight } from "lucide-react";

type Props = {
  images: string[];
  productName: string;
};

export function ProductGallery({ images, productName }: Props) {
  const photos = images.length > 0 ? images : ["/images/products/placeholder-drone.svg"];
  const [index, setIndex] = useState(0);

  const goPrev = () => setIndex((i) => (i === 0 ? photos.length - 1 : i - 1));
  const goNext = () => setIndex((i) => (i === photos.length - 1 ? 0 : i + 1));

  return (
    <div>
      <div className="relative aspect-square overflow-hidden rounded-2xl bg-fog">
        <Image
          src={photos[index]}
          alt={`${productName} — foto ${index + 1}`}
          fill
          sizes="(max-width: 1024px) 100vw, 50vw"
          className="object-contain p-4"
          priority
        />

        {photos.length > 1 && (
          <>
            <button
              type="button"
              onClick={goPrev}
              aria-label="Foto anterior"
              className="absolute left-3 top-1/2 flex h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full bg-white/90 text-ink shadow-elevate transition hover:bg-white"
            >
              <ChevronLeft size={20} />
            </button>
            <button
              type="button"
              onClick={goNext}
              aria-label="Próxima foto"
              className="absolute right-3 top-1/2 flex h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full bg-white/90 text-ink shadow-elevate transition hover:bg-white"
            >
              <ChevronRight size={20} />
            </button>

            <div className="absolute bottom-3 left-1/2 flex -translate-x-1/2 gap-1.5">
              {photos.map((url, i) => (
                <button
                  key={url + i}
                  type="button"
                  onClick={() => setIndex(i)}
                  aria-label={`Ir para foto ${i + 1}`}
                  className={`h-1.5 rounded-full transition-all ${
                    i === index ? "w-5 bg-signal" : "w-1.5 bg-white/80"
                  }`}
                />
              ))}
            </div>
          </>
        )}
      </div>

      {photos.length > 1 && (
        <div className="mt-4 grid grid-cols-4 gap-3 sm:grid-cols-6">
          {photos.map((url, i) => (
            <button
              key={url + i}
              type="button"
              onClick={() => setIndex(i)}
              aria-label={`Ver foto ${i + 1}`}
              className={`relative aspect-square overflow-hidden rounded-xl bg-fog ring-2 transition ${
                i === index ? "ring-signal" : "ring-transparent hover:ring-fog"
              }`}
            >
              <Image src={url} alt={`${productName} — miniatura ${i + 1}`} fill className="object-contain p-2" />
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
