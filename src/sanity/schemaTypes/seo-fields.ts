import { defineField } from "sanity";

export const seoGroup = { name: "seo", title: "SEO" };

const titleWarning = "Tiêu đề SEO nên dưới 60 ký tự để không bị cắt trên Google.";
const descriptionWarning = "Mô tả SEO nên dưới 160 ký tự để không bị cắt trên Google.";

const CANONICAL_HINT =
  "Chỉ điền khi trang này trùng nội dung với một trang khác và muốn Google ưu tiên trang kia. Điền sai có thể làm trang biến mất khỏi Google — để trống nếu không chắc.";

function localizedFields(suffix: "" | "En" | "Zh", label: string) {
  return [
    defineField({
      name: `seoTitle${suffix}`,
      title: `Tiêu đề SEO${label}`,
      description: suffix
        ? undefined
        : "Tiêu đề hiện trên Google, VD: Excel V+ trị giãn mao mạch - Carina Beauty Clinic. Không hiện trên trang. Để trống sẽ dùng tên/tiêu đề có sẵn.",
      type: "string",
      group: "seo",
      validation: (Rule) => Rule.max(60).warning(titleWarning),
    }),
    defineField({
      name: `seoDescription${suffix}`,
      title: `Mô tả SEO${label}`,
      description: suffix
        ? undefined
        : "Đoạn mô tả hiện dưới tiêu đề trên Google. Không hiện trên trang. Để trống sẽ dùng mô tả mặc định.",
      type: "text",
      rows: 3,
      group: "seo",
      validation: (Rule) => Rule.max(160).warning(descriptionWarning),
    }),
    defineField({
      name: `seoKeywords${suffix}`,
      title: `Từ khoá${label}`,
      description: suffix
        ? undefined
        : "Các từ khoá, cách nhau bằng dấu phẩy. Lưu ý: Google không dùng trường này để xếp hạng; chỉ một số công cụ khác đọc.",
      type: "string",
      group: "seo",
    }),
    defineField({
      name: `seoCanonical${suffix}`,
      title: `Canonical URL${label}`,
      description: CANONICAL_HINT,
      type: "url",
      group: "seo",
    }),
  ];
}

export const seoFields = [
  ...localizedFields("", ""),
  ...localizedFields("En", " (Tiếng Anh)"),
  ...localizedFields("Zh", " (Tiếng Trung)"),
  defineField({
    name: "seoImage",
    title: "Ảnh SEO",
    description:
      "Ảnh khi chia sẻ link lên Facebook, Zalo... Nên dùng tỉ lệ 1200×630. Để trống sẽ dùng ảnh của bài viết/dịch vụ.",
    type: "image",
    group: "seo",
    options: { hotspot: true },
  }),
  defineField({
    name: "seoRobots",
    title: "Meta Robots",
    description:
      'Để trống cho hầu hết các trang. Chọn "Ẩn khỏi Google" sẽ gỡ trang (ở cả 3 ngôn ngữ) khỏi kết quả tìm kiếm và sitemap.',
    type: "string",
    group: "seo",
    options: {
      list: [
        { title: "Ẩn khỏi Google, vẫn theo các link trong trang (noindex, follow)", value: "noindex, follow" },
        { title: "Ẩn khỏi Google, không theo link (noindex, nofollow)", value: "noindex, nofollow" },
      ],
    },
  }),
];
