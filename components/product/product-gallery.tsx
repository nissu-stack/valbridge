"use client";

import { useState } from "react";
import Image from "next/image";
import type { Image as ShopifyImage } from "@/lib/shopify/types";

type ProductGalleryProps = {
  images: ShopifyImage[];
  title: string;
};

export function ProductGallery({ images, title }: ProductGalleryProps) {
  const [activeImageIndex, setActiveImageIndex] = useState(0);
  const selectedImage = images[activeImageIndex] ?? images[0];
  const hasThumbnails = images.length > 1;

  if (!selectedImage) {
    return (
      <div className="flex aspect-[4/5] items-center justify-center bg-[var(--panel2)] text-sm uppercase tracking-[0.18em] text-[var(--mut)]">
        Bild nicht verfügbar
      </div>
    );
  }

  return (
    <div className={hasThumbnails ? "grid gap-4 sm:grid-cols-[72px_minmax(0,1fr)] sm:items-start" : "block"}>
      {hasThumbnails ? (
        <div className="order-2 flex gap-3 overflow-x-auto pb-1 sm:order-1 sm:flex-col sm:overflow-visible" aria-label="Produktbilder">
          {images.map((image, index) => (
            <button
              key={`${image.url}-${index}`}
              type="button"
              onClick={() => setActiveImageIndex(index)}
              className={`relative h-[88px] w-[72px] shrink-0 overflow-hidden border bg-[var(--panel2)] transition ${activeImageIndex === index ? "border-[var(--gold)]" : "border-[var(--line-soft)] opacity-70 hover:border-[var(--gold)] hover:opacity-100"}`}
              aria-label={`Produktbild ${index + 1} anzeigen`}
              aria-pressed={activeImageIndex === index}
            >
              <Image src={image.url} alt="" fill sizes="72px" className="object-cover" />
              <span className="sr-only">Bild {index + 1} von {images.length}</span>
            </button>
          ))}
        </div>
      ) : null}

      <div className={`relative aspect-[4/5] overflow-hidden bg-[var(--panel2)] ${hasThumbnails ? "order-1 sm:order-2" : ""}`}>
        <Image
          key={selectedImage.url}
          src={selectedImage.url}
          alt={selectedImage.altText ?? title}
          fill
          priority
          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 90vw, 52vw"
          className="object-contain"
        />
        {hasThumbnails ? (
          <div className="pointer-events-none absolute bottom-4 right-4 bg-[rgba(10,10,10,0.78)] px-3 py-2 text-[0.62rem] font-medium uppercase tracking-[0.18em] text-[var(--cream-dim)]">
            {String(activeImageIndex + 1).padStart(2, "0")} / {String(images.length).padStart(2, "0")}
          </div>
        ) : null}
      </div>
    </div>
  );
}
