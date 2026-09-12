import { defineArrayMember, defineField, defineType } from "sanity";
import { TREATMENT_CATEGORIES } from "@/sanity/lib/treatmentCategories";

// Singleton (see src/sanity/structure.ts). Owns, per fixed category, the
// ordered list of highlight cards shown in the homepage's "Dịch Vụ Nổi Bật"
// carousel — array position is display order. Visibility per category is
// NOT duplicated here — it's read from navigationSettings[category].show at
// query time, so there's exactly one toggle per category, not two.
function categoryField(name: string, title: string) {
  return defineField({
    name,
    title: `Danh mục: ${title}`,
    type: "object",
    fields: [
      defineField({
        name: "highlights",
        title: "Dịch vụ nổi bật (kéo thả để sắp xếp)",
        type: "array",
        of: [
          defineArrayMember({
            type: "object",
            name: "highlight",
            fields: [
              defineField({
                name: "name",
                title: "Tên",
                type: "string",
                validation: (Rule) => Rule.required(),
              }),
              defineField({ name: "nameEn", title: "Tên (Tiếng Anh)", type: "string" }),
              defineField({ name: "nameZh", title: "Tên (Tiếng Trung)", type: "string" }),
              defineField({
                name: "image",
                title: "Hình ảnh",
                type: "image",
                options: { hotspot: true },
                validation: (Rule) => Rule.required(),
              }),
              defineField({
                name: "treatment",
                title: "Liên kết đến dịch vụ chi tiết",
                description:
                  "Chọn dịch vụ để nhấn vào ảnh sẽ dẫn đến trang chi tiết dịch vụ đó. Dịch vụ phải đã được thêm vào danh mục này trong Cài Đặt Menu. Để trống nếu không cần liên kết.",
                type: "reference",
                to: [{ type: "treatment" }],
                // The URL is built from *this* category (exclusive/body-care/...),
                // so the linked treatment must actually be a member of this same
                // category in navigationSettings — otherwise the card 404s.
                validation: (Rule) =>
                  Rule.custom(async (reference, context) => {
                    if (!reference?._ref) return true;
                    const client = context.getClient({ apiVersion: "2024-01-01" });
                    const isMember = await client.fetch(
                      `count(*[_type == "navigationSettings"][0].${name}.subgroups[].treatments[_ref == $id]) > 0`,
                      { id: reference._ref },
                    );
                    return isMember ? true : `Dịch vụ này chưa được thêm vào danh mục "${title}" trong Cài Đặt Menu.`;
                  }),
              }),
            ],
            preview: {
              select: { title: "name", media: "image" },
            },
          }),
        ],
      }),
    ],
    preview: {
      select: { count: "highlights.length" },
      prepare({ count }) {
        return { title, subtitle: `${count ?? 0} dịch vụ nổi bật` };
      },
    },
  });
}

export const serviceHighlightsSettings = defineType({
  name: "serviceHighlightsSettings",
  title: "Cài Đặt Dịch Vụ Nổi Bật",
  type: "document",
  fields: TREATMENT_CATEGORIES.map((category) => categoryField(category.settingsKey, category.title)),
  preview: {
    prepare() {
      return { title: "Cài Đặt Dịch Vụ Nổi Bật" };
    },
  },
});
