import { ImageCard } from "@/components/ui/ImageCard";
import { formatCurrency, getCategoryLabel, getLocalizedText } from "@/lib/utils";

const badgeClasses = {
  bordeaux: "bg-[var(--bordeaux)] text-white",
  gold: "bg-[var(--gold)] text-white",
  green: "bg-[#4CAF50] text-white",
};

export default function MenuItemCard({ item }) {
  const badge = getCategoryLabel(item);
  const name = getLocalizedText(item?.name, "İsimsiz Ürün");
  const description = getLocalizedText(item?.description, "");

  return (
    <article className="overflow-hidden rounded-[2rem] bg-white shadow-[0_18px_40px_rgba(30,24,16,0.06)]">
      <ImageCard image={item?.image} alt={name} className="h-64 rounded-none" />
      <div className="p-7">
        <div className="flex items-start justify-between gap-4">
          <div>
            {badge ? (
              <span className={`mb-4 inline-flex rounded-full px-3 py-1 text-xs font-bold tracking-[0.2em] uppercase ${badgeClasses[badge.tone]}`}>
                {badge.label}
              </span>
            ) : null}
            <h3 className="font-playfair text-3xl text-[var(--dark)]">{name}</h3>
          </div>
          <p className="text-sm font-bold tracking-[0.16em] text-[var(--bordeaux)] uppercase">
            {formatCurrency(item?.price, item?.currency || "TRY")}
          </p>
        </div>
        <p className="mt-4 text-base leading-7 text-[var(--muted)]">
          {description || "Lezzet detayı yakında güncellenecek."}
        </p>
        {Array.isArray(item?.allergens) && item.allergens.length > 0 && (
          <div className="mt-4 flex flex-wrap gap-1.5">
            {item.allergens.map((a) => (
              <span key={a} className="inline-block rounded-full border px-2.5 py-0.5 text-[10px] font-semibold tracking-wide uppercase"
                style={{ borderColor: 'var(--beige)', color: 'var(--muted)' }}>
                {a}
              </span>
            ))}
          </div>
        )}
      </div>
    </article>
  );
}
