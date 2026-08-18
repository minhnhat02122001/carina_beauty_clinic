import { defineField, defineType } from "sanity";

export const equipmentItem = defineType({
  name: "equipmentItem",
  title: "Thiết Bị",
  type: "document",
  fields: [
    defineField({
      name: "name",
      title: "Tên",
      description: "Không hiển thị trên website — chỉ giúp bạn phân biệt các mục trong Studio.",
      type: "string",
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "machineImage",
      title: "Ảnh máy",
      type: "image",
      options: { hotspot: true },
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "logoImage",
      title: "Logo thương hiệu",
      type: "image",
      options: { hotspot: true },
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "order",
      title: "Thứ tự",
      description: "Số nhỏ hơn sẽ hiển thị trước trong carousel.",
      type: "number",
      initialValue: 0,
      validation: (Rule) => Rule.required(),
    }),
  ],
  preview: {
    select: { title: "name", media: "machineImage" },
  },
});
