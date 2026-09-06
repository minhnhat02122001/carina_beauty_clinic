import { slugify } from "@/lib/slugify";
import { defineArrayMember, defineField, defineType } from "sanity";

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
      name: "keyInfo",
      title: "Thông tin nhanh",
      description:
        "Các tiêu chí hiển thị ở đầu trang chi tiết dịch vụ (VD: Thời gian thực hiện, Công nghệ sử dụng...). Mỗi dịch vụ có thể có số lượng và loại tiêu chí khác nhau — thêm bao nhiêu tuỳ ý.",
      type: "array",
      group: "vietnamese",
      of: [
        defineArrayMember({
          type: "object",
          name: "treatmentCriterion",
          fields: [
            defineField({ name: "label", title: "Tên tiêu chí", type: "string", validation: (Rule) => Rule.required() }),
            defineField({ name: "labelEn", title: "Tên tiêu chí (Tiếng Anh)", type: "string" }),
            defineField({ name: "labelZh", title: "Tên tiêu chí (Tiếng Trung)", type: "string" }),
            defineField({ name: "value", title: "Giá trị", type: "string", validation: (Rule) => Rule.required() }),
            defineField({ name: "valueEn", title: "Giá trị (Tiếng Anh)", type: "string" }),
            defineField({ name: "valueZh", title: "Giá trị (Tiếng Trung)", type: "string" }),
          ],
          preview: { select: { title: "label", subtitle: "value" } },
        }),
      ],
    }),
    defineField({
      name: "sections",
      title: "Các mục chi tiết",
      description:
        "Thêm các mục nội dung chi tiết tuỳ ý (VD: Quy trình thực hiện, Đối tượng chống chỉ định, Lưu ý trước/sau điều trị...).",
      type: "array",
      group: "vietnamese",
      of: [
        defineArrayMember({
          type: "object",
          name: "treatmentSection",
          fields: [
            defineField({ name: "heading", title: "Tiêu đề mục", type: "string", validation: (Rule) => Rule.required() }),
            defineField({ name: "headingEn", title: "Tiêu đề mục (Tiếng Anh)", type: "string" }),
            defineField({ name: "headingZh", title: "Tiêu đề mục (Tiếng Trung)", type: "string" }),
            defineField({
              name: "body",
              title: "Nội dung",
              type: "array",
              of: [{ type: "block" }, { type: "image", options: { hotspot: true } }],
            }),
            defineField({
              name: "bodyEn",
              title: "Nội dung (Tiếng Anh)",
              type: "array",
              of: [{ type: "block" }, { type: "image", options: { hotspot: true } }],
            }),
            defineField({
              name: "bodyZh",
              title: "Nội dung (Tiếng Trung)",
              type: "array",
              of: [{ type: "block" }, { type: "image", options: { hotspot: true } }],
            }),
          ],
          preview: { select: { title: "heading" } },
        }),
      ],
    }),
    defineField({
      name: "faqs",
      title: "Câu hỏi thường gặp",
      type: "array",
      group: "vietnamese",
      of: [
        defineArrayMember({
          type: "object",
          name: "faqItem",
          fields: [
            defineField({ name: "question", title: "Câu hỏi", type: "string", validation: (Rule) => Rule.required() }),
            defineField({ name: "questionEn", title: "Câu hỏi (Tiếng Anh)", type: "string" }),
            defineField({ name: "questionZh", title: "Câu hỏi (Tiếng Trung)", type: "string" }),
            defineField({
              name: "answer",
              title: "Trả lời",
              type: "text",
              rows: 3,
              validation: (Rule) => Rule.required(),
            }),
            defineField({ name: "answerEn", title: "Trả lời (Tiếng Anh)", type: "text", rows: 3 }),
            defineField({ name: "answerZh", title: "Trả lời (Tiếng Trung)", type: "text", rows: 3 }),
          ],
          preview: { select: { title: "question" } },
        }),
      ],
    }),
    defineField({
      name: "reviewedByDoctors",
      title: "Bác sĩ tư vấn / kiểm duyệt chuyên môn",
      description: "Hiển thị hộp xác nhận chuyên môn ở trang chi tiết dịch vụ. Để trống nếu không cần.",
      type: "array",
      of: [defineArrayMember({ type: "reference", to: [{ type: "doctor" }] })],
      group: "metadata",
      // Pre-fill new documents with every doctor that already exists, since
      // most treatments are reviewed by the whole medical team by default.
      initialValue: async (_, { getClient }) => {
        const client = getClient({ apiVersion: "2024-01-01" });
        const doctorIds: string[] = await client.fetch(`*[_type == "doctor"] | order(order asc)._id`);
        return doctorIds.map((id) => ({ _type: "reference", _ref: id, _key: id }));
      },
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
