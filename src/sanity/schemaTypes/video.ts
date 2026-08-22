import { defineField, defineType } from "sanity";

export const video = defineType({
  name: "video",
  title: "Video",
  type: "document",
  groups: [
    { name: "vietnamese", title: "Tiếng Việt (gốc)", default: true },
    { name: "english", title: "Tiếng Anh" },
    { name: "chinese", title: "Tiếng Trung" },
    { name: "media", title: "Hình ảnh" },
    { name: "metadata", title: "Thông tin khác" },
  ],
  fields: [
    // Vietnamese (source of truth) — every video is captioned here first.
    defineField({
      name: "description",
      title: "Mô tả",
      type: "text",
      rows: 3,
      group: "vietnamese",
      validation: (Rule) => Rule.required(),
    }),

    // English
    defineField({ name: "descriptionEn", title: "Mô tả (Tiếng Anh)", type: "text", rows: 3, group: "english" }),

    // Chinese
    defineField({ name: "descriptionZh", title: "Mô tả (Tiếng Trung)", type: "text", rows: 3, group: "chinese" }),

    // Media
    defineField({
      name: "thumbnail",
      title: "Ảnh thu nhỏ",
      type: "image",
      group: "media",
      options: { hotspot: true },
      validation: (Rule) => Rule.required(),
    }),

    // Metadata
    defineField({
      name: "youtubeUrl",
      title: "Liên kết YouTube",
      description: "Dán đường dẫn YouTube đầy đủ. Để trống để hiển thị ảnh thu nhỏ dạng 'sắp ra mắt'.",
      type: "url",
      group: "metadata",
    }),
    defineField({
      name: "duration",
      title: "Thời lượng",
      description: "Nhãn hiển thị tuỳ chọn, VD: 0:32",
      type: "string",
      group: "metadata",
    }),
    defineField({
      name: "tags",
      title: "Thẻ",
      type: "array",
      group: "metadata",
      of: [{ type: "string" }],
      options: { layout: "tags" },
    }),
    defineField({
      name: "publishedAt",
      title: "Ngày đăng",
      type: "datetime",
      group: "metadata",
      initialValue: () => new Date().toISOString(),
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "featured",
      title: "Hiển thị nổi bật ở trang chủ",
      description: "Hiển thị trong carousel Video Ngắn Nổi Bật ở trang chủ.",
      type: "boolean",
      group: "metadata",
      initialValue: false,
    }),
  ],
  preview: {
    select: { title: "description", media: "thumbnail" },
  },
});
