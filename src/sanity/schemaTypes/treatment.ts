import { slugify } from "@/lib/slugify";
import { defineField, defineType } from "sanity";

const CATEGORY_OPTIONS = [
  { title: "Độc quyền", value: "exclusive" },
  { title: "Nâng cơ - xoá nhăn", value: "lifting-rejuvenation" },
  { title: "Điều trị da", value: "skin-therapy" },
  { title: "Tiêm trẻ hóa", value: "rejuvenation-injections" },
  { title: "Chăm sóc vóc dáng", value: "body-care" },
  { title: "Chăm sóc da, cơ thể", value: "skin-care" },
];

export const treatment = defineType({
  name: "treatment",
  title: "Dịch Vụ Chi Tiết",
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
    defineField({
      name: "description",
      title: "Mô tả",
      type: "array",
      group: "vietnamese",
      of: [{ type: "block" }, { type: "image", options: { hotspot: true } }],
    }),
    defineField({ name: "nameEn", title: "Tên (Tiếng Anh)", type: "string", group: "english" }),
    defineField({
      name: "descriptionEn",
      title: "Mô tả (Tiếng Anh)",
      type: "array",
      group: "english",
      of: [{ type: "block" }, { type: "image", options: { hotspot: true } }],
    }),
    defineField({ name: "nameZh", title: "Tên (Tiếng Trung)", type: "string", group: "chinese" }),
    defineField({
      name: "descriptionZh",
      title: "Mô tả (Tiếng Trung)",
      type: "array",
      group: "chinese",
      of: [{ type: "block" }, { type: "image", options: { hotspot: true } }],
    }),
    defineField({
      name: "images",
      title: "Hình ảnh",
      description: "Có thể thêm nhiều ảnh — kéo thả để sắp xếp thứ tự hiển thị trên trang chi tiết.",
      type: "array",
      group: "media",
      of: [{ type: "image", options: { hotspot: true } }],
    }),
    defineField({
      name: "slug",
      title: "Đường dẫn",
      type: "slug",
      group: "metadata",
      options: { source: "name", maxLength: 96, slugify },
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "category",
      title: "Danh mục",
      type: "string",
      group: "metadata",
      options: { list: CATEGORY_OPTIONS, layout: "radio" },
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "subgroup",
      title: "Nhóm con",
      description:
        "Tùy chọn cho mọi danh mục — nhóm các dịch vụ theo tiêu đề phụ (VD: Điều trị sắc tố - mạch máu, Điều trị mụn, Điều trị sẹo - lỗ chân lông). Để trống nếu không thuộc nhóm con nào.",
      type: "string",
      group: "metadata",
    }),
    defineField({ name: "subgroupEn", title: "Nhóm con (Tiếng Anh)", type: "string", group: "english" }),
    defineField({ name: "subgroupZh", title: "Nhóm con (Tiếng Trung)", type: "string", group: "chinese" }),
    defineField({
      name: "order",
      title: "Thứ tự",
      description: "Số nhỏ hơn sẽ hiển thị trước trong menu và danh sách.",
      type: "number",
      group: "metadata",
      initialValue: 0,
      validation: (Rule) => Rule.required(),
    }),
  ],
  preview: {
    select: { title: "name", subtitle: "category", media: "images.0" },
  },
});
