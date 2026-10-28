import { DynamicSchemas } from "@/components/layout/DynamicSchemas";
import { getScopedSchemas } from "@/lib/api";

// Panelde "kapsamı" bu sayfa olan JSON-LD şemalarını ekler (global olanlar layout'ta).
export async function PageSchemas({ scope }) {
  const schemas = await getScopedSchemas(scope).catch(() => null);
  return <DynamicSchemas schemas={schemas} />;
}
