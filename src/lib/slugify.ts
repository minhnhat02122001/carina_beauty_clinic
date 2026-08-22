// Sanity's default slugify only lowercases + hyphenates — it leaves Vietnamese
// diacritics (and đ/Đ, which NFD normalization doesn't decompose) untouched.
// This strips them so generated slugs stay plain ASCII.
export function slugify(input: string): string {
  return input
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .replace(/đ/g, "d")
    .replace(/Đ/g, "D")
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 96);
}
