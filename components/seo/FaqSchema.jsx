import { getLocalizedText } from "@/lib/utils";

export function FaqSchema({ faqs }) {
  const schema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: (faqs || []).map((faq) => ({
      "@type": "Question",
      name: getLocalizedText(faq.question),
      acceptedAnswer: {
        "@type": "Answer",
        text: getLocalizedText(faq.answer),
      },
    })),
  };

  return <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }} />;
}
