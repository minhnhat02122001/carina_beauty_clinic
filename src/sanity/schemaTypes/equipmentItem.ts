import { defineField, defineType } from "sanity";

export const equipmentItem = defineType({
  name: "equipmentItem",
  title: "Máy Công Nghệ Cao",
  type: "document",
  fields: [
    defineField({
      name: "name",
      title: "Tên",
      description:
        "Ghi đúng tên thiết bị (VD: Thermage FLX). Không hiện thành chữ trên trang, nhưng được dùng làm mô tả ảnh (alt) cho Google và người khiếm thị.",
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
