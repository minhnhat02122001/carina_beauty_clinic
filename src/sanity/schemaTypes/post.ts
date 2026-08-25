import { defineField, defineType } from "sanity";
import { slugify } from "@/lib/slugify";

export const post = defineType({
  name: "post",
  title: "Bài Viết",
  type: "document",
  groups: [
    { name: "vietnamese", title: "Tiếng Việt (gốc)", default: true },
    { name: "english", title: "Tiếng Anh" },
    { name: "chinese", title: "Tiếng Trung" },
    { name: "media", title: "Hình ảnh" },
    { name: "metadata", title: "Thông tin khác" },
  ],
  fields: [
    // Vietnamese (source of truth) — every post is authored here first.
    defineField({
      name: "title",
      title: "Tiêu đề",
      type: "string",
      group: "vietnamese",
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "excerpt",
      title: "Tóm tắt",
      description: "Cũng dùng làm mô tả SEO — nên giữ dưới 160 ký tự.",
      type: "text",
      rows: 3,
      group: "vietnamese",
      validation: (Rule) => Rule.max(160).warning("Mô tả SEO nên dưới 160 ký tự để không bị cắt trên Google."),
    }),
    defineField({
      name: "body",
      title: "Nội dung",
      type: "array",
      group: "vietnamese",
      of: [{ type: "block" }, { type: "image", options: { hotspot: true } }],
    }),

    // English
    defineField({ name: "titleEn", title: "Tiêu đề (Tiếng Anh)", type: "string", group: "english" }),
    defineField({
      name: "excerptEn",
      title: "Tóm tắt (Tiếng Anh)",
      type: "text",
      rows: 3,
      group: "english",
      validation: (Rule) => Rule.max(160).warning("Mô tả SEO nên dưới 160 ký tự để không bị cắt trên Google."),
    }),
    defineField({
      name: "bodyEn",
      title: "Nội dung (Tiếng Anh)",
      type: "array",
      group: "english",
      of: [{ type: "block" }, { type: "image", options: { hotspot: true } }],
    }),

    // Chinese
    defineField({ name: "titleZh", title: "Tiêu đề (Tiếng Trung)", type: "string", group: "chinese" }),
    defineField({
      name: "excerptZh",
      title: "Tóm tắt (Tiếng Trung)",
      type: "text",
      rows: 3,
      group: "chinese",
      validation: (Rule) => Rule.max(160).warning("Mô tả SEO nên dưới 160 ký tự để không bị cắt trên Google."),
    }),
    defineField({
      name: "bodyZh",
      title: "Nội dung (Tiếng Trung)",
      type: "array",
      group: "chinese",
      of: [{ type: "block" }, { type: "image", options: { hotspot: true } }],
    }),

    // Media
    defineField({
      name: "coverImage",
      title: "Ảnh bìa",
      type: "image",
      group: "media",
      options: { hotspot: true },
      validation: (Rule) => Rule.required(),
    }),
    // Metadata
    defineField({
      name: "slug",
      title: "Đường dẫn",
      type: "slug",
      group: "metadata",
      options: { source: "title", maxLength: 96, slugify },
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "category",
      title: "Danh mục",
      type: "string",
      group: "metadata",
      options: {
        list: [
          { title: "Tin Tức - Sự Kiện", value: "newsEvents" },
          { title: "Khuyến Mãi", value: "promotions" },
          { title: "Kiến Thức Làm Đẹp", value: "beautyKnowledge" },
        ],
        layout: "radio",
      },
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "tags",
      title: "Thẻ",
      description: "VD: hashtag từ bài viết gốc: excelv, laser, unbox",
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
      description: "Hiển thị trong carousel Tin Tức - Sự Kiện ở trang chủ.",
      type: "boolean",
      group: "metadata",
      initialValue: false,
    }),
  ],
  preview: {
    select: { title: "title", subtitle: "category", media: "coverImage" },
  },
});
