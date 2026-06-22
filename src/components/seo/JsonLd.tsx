/**
 * Renders a JSON-LD structured-data block. Server Component.
 *
 * Pass the output of any builder in src/lib/seo/jsonld.ts (or an array of them):
 *   <JsonLd data={organizationJsonLd()} />
 *   <JsonLd data={[productJsonLd(...), breadcrumbJsonLd(...)]} />
 */
export function JsonLd({
  data,
}: {
  data: Record<string, unknown> | Record<string, unknown>[];
}) {
  return (
    <script
      type="application/ld+json"
      // JSON.stringify output is safe to embed; we render one tag per call.
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }}
    />
  );
}

export default JsonLd;
