// `<` is escaped so a "</script>" inside editor-written content can't close the tag early. The double backslash
// matters: with one, the JS string is just `<` again and the replace does nothing.
export function JsonLd({ data }: { data: object }) {
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data).replace(/</g, "\\u003c") }}
    />
  );
}
