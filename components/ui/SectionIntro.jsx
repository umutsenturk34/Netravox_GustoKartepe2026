export function SectionIntro({ eyebrow, title, description, align = "left", light = false }) {
  const alignment = align === "center" ? "mx-auto text-center" : "";
  const titleColor = light ? "text-white" : "text-[var(--dark)]";
  const textColor = light ? "text-white/70" : "text-[var(--muted)]";

  return (
    <div className={`max-w-2xl ${alignment}`}>
      {eyebrow ? (
        <p className="mb-4 inline-flex rounded-full border border-[var(--gold)] px-4 py-2 text-xs font-bold tracking-[0.35em] text-[var(--gold)] uppercase">
          {eyebrow}
        </p>
      ) : null}
      <h2 className={`whitespace-pre-line font-playfair text-4xl leading-tight md:text-5xl ${titleColor}`}>
        {title}
      </h2>
      {description ? (
        /[<&]/.test(description) ? (
          <div
            className={`mt-5 text-base leading-7 md:text-lg ${textColor} [&_p]:mb-3 [&_p:last-child]:mb-0`}
            dangerouslySetInnerHTML={{ __html: description }}
          />
        ) : (
          <p className={`mt-5 text-base leading-7 md:text-lg ${textColor}`}>{description}</p>
        )
      ) : null}
    </div>
  );
}
