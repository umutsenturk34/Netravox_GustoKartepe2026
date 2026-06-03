import Image from "next/image";

import { normalizeImage } from "@/lib/utils";

export function ImageCard({
  image,
  alt,
  className = "",
  priority = false,
  overlay = null,
  sizes = "(min-width: 1024px) 33vw, 100vw",
}) {
  const src = normalizeImage(image);

  return (
    <div className={`relative overflow-hidden rounded-[2rem] bg-[var(--beige)] ${className}`}>
      {src ? (
        <Image
          src={src}
          alt={alt}
          fill
          priority={priority}
          sizes={sizes}
          className="object-cover"
        />
      ) : (
        <div className="absolute inset-0 flex items-center justify-center bg-[var(--beige)] p-6 text-center text-sm tracking-[0.2em] text-[var(--muted)] uppercase">
          Gorsel Hazirlaniyor
        </div>
      )}
      {overlay ? <div className="absolute inset-0">{overlay}</div> : null}
    </div>
  );
}
