"use client";

import Link from "next/link";
import { useEffect } from "react";

export default function Error({ error, reset }) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <main className="flex min-h-screen items-center justify-center bg-[var(--cream)] px-6 py-24">
      <div className="max-w-xl text-center">
        <p className="mb-4 inline-flex rounded-full border border-[var(--bordeaux)] px-4 py-2 text-xs tracking-[0.3em] text-[var(--bordeaux)] uppercase">
          Bir Hata Oluştu
        </p>
        <h1 className="font-playfair text-5xl leading-tight text-[var(--dark)] md:text-6xl">
          Sayfa yüklenirken bir sorun oluştu.
        </h1>
        <p className="mt-6 text-lg text-[var(--muted)]">
          Lütfen tekrar deneyin. Sorun devam ederse ana sayfaya dönebilirsiniz.
        </p>
        <div className="mt-8 flex flex-col items-center gap-3 sm:flex-row sm:justify-center">
          <button
            onClick={reset}
            className="inline-flex rounded-full bg-[var(--bordeaux)] px-6 py-3 text-sm font-bold tracking-[0.2em] text-white uppercase transition hover:opacity-90"
          >
            Tekrar Dene
          </button>
          <Link
            href="/"
            className="inline-flex rounded-full border border-[var(--bordeaux)] px-6 py-3 text-sm font-bold tracking-[0.2em] text-[var(--bordeaux)] uppercase transition hover:bg-[var(--beige)]"
          >
            Ana Sayfaya Dön
          </Link>
        </div>
      </div>
    </main>
  );
}
