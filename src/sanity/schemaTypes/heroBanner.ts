import { defineField, defineType } from "sanity";

export const heroBanner = defineType({
  name: "heroBanner",
  title: "Banner Trang Chủ",
  type: "document",
  fields: [
    defineField({
      name: "imageDesktop",
      title: "Hình ảnh (Desktop)",
      type: "image",
      options: { hotspot: true },
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "imageMobile",
      title: "Hình ảnh (Mobile)",
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
    defineField({
      name: "alt",
      title: "Mô tả ảnh (alt)",
      description:
        "Mô tả ngắn nội dung banner cho Google và người khiếm thị, VD: Ưu đãi nâng cơ trẻ hóa tháng 10. Để trống sẽ dùng tên phòng khám.",
      type: "string",
    }),
    defineField({ name: "altEn", title: "Mô tả ảnh (Tiếng Anh)", type: "string" }),
    defineField({ name: "altZh", title: "Mô tả ảnh (Tiếng Trung)", type: "string" }),
  ],
  preview: {
    select: { media: "imageDesktop", order: "order" },
    prepare({ media, order }) {
      return { title: `Banner (thứ tự ${order ?? 0})`, media };
    },
  },
});
