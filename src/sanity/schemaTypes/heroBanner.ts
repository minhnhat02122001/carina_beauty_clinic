import { defineField, defineType } from "sanity";

export const heroBanner = defineType({
  name: "heroBanner",
  title: "Banner Trang Chủ",
  type: "document",
  fields: [
    defineField({
      name: "image",
      title: "Hình ảnh",
      type: "image",
      options: { hotspot: true },
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "order",
      title: "Thứ tự",
      description: "Số nhỏ hơn sẽ hiển thị trước trong carousel trang chủ.",
      type: "number",
      initialValue: 0,
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "url",
      title: "Liên kết trang đích",
      description:
        "Dán URL đầy đủ (VD: https://...) hoặc đường dẫn nội bộ (VD: /khuyen-mai). Để trống nếu banner không cần liên kết.",
      type: "url",
      validation: (Rule) => Rule.uri({ allowRelative: true, scheme: ["http", "https"] }),
    }),
  ],
  preview: {
    select: { media: "image", order: "order" },
    prepare({ media, order }) {
      return { title: `Banner (thứ tự ${order ?? 0})`, media };
    },
  },
});
