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

  if (!selectedImage) {
    return null;
  }

  return (
    <div className="space-y-4">
      <div className="overflow-hidden rounded-[2rem] border border-zinc-200 bg-zinc-50 shadow-sm">
        <Image
          src={selectedImage.url}
          alt={selectedImage.altText ?? title}
          width={selectedImage.width ?? 1400}
          height={selectedImage.height ?? 1400}
          sizes="(max-width: 1024px) 100vw, 50vw"
          className="h-full w-full object-cover"
        />
      </div>
      {images.length > 1 ? (
        <div className="flex flex-wrap gap-3">
          {images.map((image, index) => (
            <button
              key={`${image.url}-${index}`}
              type="button"
              onClick={() => setActiveImageIndex(index)}
              className={`overflow-hidden rounded-2xl border transition ${activeImageIndex === index ? "border-zinc-950" : "border-zinc-200"}`}
              aria-label={`Show image ${index + 1}`}
            >
              <Image src={image.url} alt={image.altText ?? title} width={120} height={120} sizes="96px" className="h-20 w-20 object-cover" />
            </button>
          ))}
        </div>
      ) : null}
    </div>
  );
}
