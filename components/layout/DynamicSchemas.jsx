export function DynamicSchemas({ schemas }) {
  if (!Array.isArray(schemas) || schemas.length === 0) return null;

  return schemas.map((schema, index) => (
    <script
      key={index}
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  ));
}
