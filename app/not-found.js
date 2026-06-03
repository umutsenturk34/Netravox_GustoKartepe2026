import Link from "next/link";

export default function NotFound() {
  return (
    <main className="flex min-h-screen items-center justify-center bg-[var(--cream)] px-6 py-24">
      <div className="max-w-xl text-center">
        <p className="mb-4 inline-flex rounded-full border border-[var(--gold)] px-4 py-2 text-xs tracking-[0.3em] text-[var(--gold)] uppercase">
          Sayfa Bulunamadi
        </p>
        <h1 className="font-playfair text-5xl leading-tight text-[var(--dark)] md:text-6xl">
          Aradiginiz sayfaya su an ulasilamiyor.
        </h1>
        <p className="mt-6 text-lg text-[var(--muted)]">
          Ana sayfaya donerek restoran, menu ve rezervasyon iceriklerine hizlica ulasabilirsiniz.
        </p>
        <Link
          href="/"
          className="mt-8 inline-flex rounded-full bg-[var(--bordeaux)] px-6 py-3 text-sm font-bold tracking-[0.2em] text-white uppercase transition hover:opacity-90"
        >
          Ana Sayfaya Don
        </Link>
      </div>
    </main>
  );
}
