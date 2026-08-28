import { defineField, defineType } from "sanity";

// Singleton (see src/sanity/structure.ts) — toggles which of the site's fixed
// service links show in the header nav. Doesn't add/remove/reorder items;
// "About" always shows and isn't listed here since it can't be hidden.
export const navigationSettings = defineType({
  name: "navigationSettings",
  title: "Cài Đặt Menu",
  type: "document",
  fields: [
    defineField({
      name: "showExclusive",
      title: "Hiển thị: Độc quyền",
      type: "boolean",
      initialValue: true,
    }),
    defineField({
      name: "showLiftingRejuvenation",
      title: "Hiển thị: Nâng cơ - xoá nhăn",
      type: "boolean",
      initialValue: true,
    }),
    defineField({
      name: "showSkinTherapy",
      title: "Hiển thị: Điều trị da",
      type: "boolean",
      initialValue: true,
    }),
    defineField({
      name: "showRejuvenationInjections",
      title: "Hiển thị: Tiêm trẻ hóa",
      type: "boolean",
      initialValue: true,
    }),
    defineField({
      name: "showBodyCare",
      title: "Hiển thị: Chăm sóc vóc dáng",
      type: "boolean",
      initialValue: true,
    }),
    defineField({
      name: "showSkinCare",
      title: "Hiển thị: Chăm sóc da",
      type: "boolean",
      initialValue: true,
    }),
  ],
  preview: {
    prepare() {
      return { title: "Cài Đặt Menu" };
    },
  },
});
