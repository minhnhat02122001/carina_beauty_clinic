import { defineField, defineType } from "sanity";

const CATEGORY_OPTIONS = [
  { title: "Độc quyền", value: "chipExclusive" },
  { title: "Nâng cơ trẻ hoá", value: "chipLiftingRejuvenation" },
  { title: "Điều trị da", value: "chipSkinTreatment" },
  { title: "Tiêm trẻ hoá", value: "chipRejuvenationInjections" },
  { title: "Chăm sóc vóc dáng", value: "chipBodyCare" },
  { title: "Chăm sóc da", value: "chipSkinCare" },
];

export const serviceHighlight = defineType({
  name: "serviceHighlight",
  title: "Dịch Vụ Nổi Bật",
  type: "document",
  groups: [
    { name: "vietnamese", title: "Tiếng Việt (gốc)", default: true },
    { name: "english", title: "Tiếng Anh" },
    { name: "chinese", title: "Tiếng Trung" },
    { name: "media", title: "Hình ảnh" },
    { name: "metadata", title: "Thông tin khác" },
  ],
  fields: [
    defineField({
      name: "name",
      title: "Tên",
      type: "string",
      group: "vietnamese",
      validation: (Rule) => Rule.required(),
    }),
    defineField({ name: "nameEn", title: "Tên (Tiếng Anh)", type: "string", group: "english" }),
    defineField({ name: "nameZh", title: "Tên (Tiếng Trung)", type: "string", group: "chinese" }),
    defineField({
      name: "image",
      title: "Hình ảnh",
      type: "image",
      group: "media",
      options: { hotspot: true },
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "categories",
      title: "Danh mục",
      description: "Thẻ lọc nào mà mục này sẽ xuất hiện. Chọn ít nhất một.",
      type: "array",
      group: "metadata",
      of: [{ type: "string" }],
      options: { list: CATEGORY_OPTIONS },
      validation: (Rule) => Rule.required().min(1),
    }),
    defineField({
      name: "order",
      title: "Thứ tự",
      description: "Số nhỏ hơn sẽ hiển thị trước trong carousel.",
      type: "number",
      group: "metadata",
      initialValue: 0,
      validation: (Rule) => Rule.required(),
    }),
  ],
  preview: {
    select: { title: "name", media: "image" },
  },
});
