import Link from "next/link";
import { ChevronRight, Home } from "lucide-react";

export function Breadcrumb({ items = [] }) {
  return (
    <nav aria-label="Breadcrumb" className="border-b border-[var(--beige)] bg-[var(--cream)]">
      <div className="container-shell py-3">
        <ol className="flex flex-wrap items-center gap-1 text-xs text-[var(--muted)]">
          {items.map((item, i) => {
            const isLast = i === items.length - 1;
            return (
              <li key={i} className="flex items-center gap-1">
                {i > 0 && (
                  <ChevronRight size={11} className="shrink-0 text-[var(--beige)]" strokeWidth={2.5} />
                )}
                {i === 0 && (
                  <Home size={11} className="mr-0.5 shrink-0" />
                )}
                {isLast ? (
                  <span className="font-medium text-[var(--dark)] line-clamp-1 max-w-[200px]">
                    {item.name}
                  </span>
                ) : (
                  <Link
                    href={item.url}
                    className="transition-colors hover:text-[var(--bordeaux)]"
                  >
                    {item.name}
                  </Link>
                )}
              </li>
            );
          })}
        </ol>
      </div>
    </nav>
  );
}
