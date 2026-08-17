/**
 * Structured data (§15.1.4). Emitted as a plain script tag in the prerendered
 * HTML, so it is present in view-source before any script runs.
 */
export function JsonLd({ data }: { data: object }) {
  return (
    <script
      type="application/ld+json"
      // The payload is built from our own dictionaries, never from user input.
      dangerouslySetInnerHTML={{
        __html: JSON.stringify(data).replace(/</g, '\\u003c'),
      }}
    />
  );
}
