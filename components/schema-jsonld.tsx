import { getSchemaJsonLd } from '@/lib/schema';

export default function SchemaJsonLd() {
  const schemas = getSchemaJsonLd();

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(schemas.organization) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(schemas.website) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(schemas.softwareApplication) }}
      />
    </>
  );
}
