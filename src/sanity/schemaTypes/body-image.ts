import { defineArrayMember, defineField } from "sanity";

// An image inside a Portable Text body. Every body field is already per-locale (body / bodyEn / bodyZh),
// so the alt typed here is in that body's language.
export const bodyImage = defineArrayMember({
  type: "image",
  options: { hotspot: true },
  fields: [
    defineField({
      name: "alt",
      title: "Mô tả ảnh (alt)",
      description: "Mô tả ngắn nội dung ảnh cho Google và người khiếm thị, viết cùng ngôn ngữ với nội dung.",
      type: "string",
    }),
  ],
});
