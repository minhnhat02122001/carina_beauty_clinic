import { defineArrayMember, defineField, defineType } from "sanity";

// Singleton (see src/sanity/structure.ts). Owns every editable image, video
// link and press entry on the "Về Chúng Tôi" page. Grouped by page section
// rather than by language so an editor finds a field where they see it on
// the page; array position is display order everywhere (drag to rearrange).
export const aboutSettings = defineType({
  name: "aboutSettings",
  title: "Cài Đặt Trang Về Chúng Tôi",
  type: "document",
  groups: [
    { name: "intro", title: "Giới thiệu", default: true },
    { name: "technology", title: "Công nghệ" },
    { name: "testimonials", title: "Đánh giá khách hàng" },
    { name: "press", title: "Báo chí" },
    { name: "closing", title: "Kết trang" },
  ],
  fields: [
    // Giới thiệu
    defineField({
      name: "introVideoUrl",
      title: "Liên kết YouTube (clip giới thiệu)",
      description: "Dán đường dẫn YouTube đầy đủ. Nên dùng clip dọc 9:16. Để trống để ẩn clip.",
      type: "url",
      group: "intro",
      validation: (Rule) => Rule.uri({ scheme: ["http", "https"] }),
    }),
    defineField({
      name: "introVideoThumbnail",
      title: "Ảnh thu nhỏ của clip",
      description: "Ảnh dọc 9:16 hiển thị trước khi nhấn phát.",
      type: "image",
      group: "intro",
      options: { hotspot: true },
    }),

    // Công nghệ
    defineField({
      name: "technologyImages",
      title: "Hình công nghệ (kéo thả để sắp xếp)",
      description: "Hiển thị 4 hình trên máy tính và 2 hình trên điện thoại.",
      type: "array",
      group: "technology",
      of: [defineArrayMember({ type: "image", options: { hotspot: true } })],
    }),

    // Đánh giá khách hàng
    defineField({
      name: "testimonialImages",
      title: "Hình đánh giá khách hàng (kéo thả để sắp xếp)",
      type: "array",
      group: "testimonials",
      of: [defineArrayMember({ type: "image", options: { hotspot: true } })],
    }),

    // Báo chí
    defineField({
      name: "pressMentions",
      title: "Bài báo (kéo thả để sắp xếp)",
      type: "array",
      group: "press",
      of: [
        defineArrayMember({
          type: "object",
          name: "pressMention",
          fields: [
            defineField({
              name: "title",
              title: "Tiêu đề bài viết",
              type: "string",
              validation: (Rule) => Rule.required(),
            }),
            defineField({ name: "titleEn", title: "Tiêu đề bài viết (Tiếng Anh)", type: "string" }),
            defineField({ name: "titleZh", title: "Tiêu đề bài viết (Tiếng Trung)", type: "string" }),
            defineField({
              name: "outletName",
              title: "Tên báo",
              description: "VD: VnExpress. Không cần dịch.",
              type: "string",
            }),
            defineField({
              name: "screenshot",
              title: "Ảnh chụp bài báo",
              type: "image",
              options: { hotspot: true },
              validation: (Rule) => Rule.required(),
            }),
            defineField({
              name: "url",
              title: "Liên kết bài viết",
              type: "url",
              validation: (Rule) => Rule.required().uri({ scheme: ["http", "https"] }),
            }),
          ],
          preview: {
            select: { title: "title", subtitle: "outletName", media: "screenshot" },
          },
        }),
      ],
    }),

    // Kết trang
    defineField({
      name: "closingImages",
      title: "Ảnh kết trang (kéo thả để sắp xếp)",
      type: "array",
      group: "closing",
      of: [defineArrayMember({ type: "image", options: { hotspot: true } })],
    }),
  ],
  preview: {
    prepare() {
      return { title: "Cài Đặt Trang Về Chúng Tôi" };
    },
  },
});
