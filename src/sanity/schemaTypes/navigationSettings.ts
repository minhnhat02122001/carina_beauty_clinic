import { defineArrayMember, defineField, defineType } from "sanity";
import { TREATMENT_CATEGORIES } from "@/sanity/lib/treatmentCategories";

// Singleton (see src/sanity/structure.ts). Owns, per fixed category: whether
// its nav link shows, and the ordered subgroups/treatments that make up its
// dropdown/accordion and listing page — array position is display order, so
// there's no separate "order" number to keep in sync. "About" always shows
// and isn't listed here since it can't be hidden.
function categoryField(name: string, title: string) {
  return defineField({
    name,
    title: `Danh mục: ${title}`,
    type: "object",
    fields: [
      defineField({
        name: "show",
        title: "Hiển thị trên menu",
        type: "boolean",
        initialValue: true,
      }),
      defineField({
        name: "subgroups",
        title: "Nhóm dịch vụ (kéo thả để sắp xếp)",
        description:
          "Mỗi nhóm hiển thị dưới một tiêu đề phụ trong menu/danh sách. Để trống tiêu đề nếu muốn các dịch vụ hiển thị không phân nhóm.",
        type: "array",
        of: [
          defineArrayMember({
            type: "object",
            name: "subgroup",
            fields: [
              defineField({ name: "label", title: "Tên nhóm (để trống nếu không cần nhóm)", type: "string" }),
              defineField({ name: "labelEn", title: "Tên nhóm (Tiếng Anh)", type: "string" }),
              defineField({ name: "labelZh", title: "Tên nhóm (Tiếng Trung)", type: "string" }),
              defineField({
                name: "treatments",
                title: "Dịch vụ (kéo thả để sắp xếp)",
                type: "array",
                of: [defineArrayMember({ type: "reference", to: [{ type: "treatment" }] })],
                validation: (Rule) => Rule.required().min(1),
              }),
            ],
            preview: {
              select: { label: "label", count: "treatments.length" },
              prepare({ label, count }) {
                return { title: label || "(Không phân nhóm)", subtitle: `${count ?? 0} dịch vụ` };
              },
            },
          }),
        ],
      }),
    ],
    preview: {
      select: { show: "show", count: "subgroups.length" },
      prepare({ show, count }) {
        return { title, subtitle: `${show ? "Đang hiển thị" : "Đang ẩn"} · ${count ?? 0} nhóm` };
      },
    },
  });
}

export const navigationSettings = defineType({
  name: "navigationSettings",
  title: "Cài Đặt Menu",
  type: "document",
  fields: TREATMENT_CATEGORIES.map((category) => categoryField(category.settingsKey, category.title)),
  preview: {
    prepare() {
      return { title: "Cài Đặt Menu" };
    },
  },
});
