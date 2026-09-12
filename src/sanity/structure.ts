import type { StructureResolver } from "sanity/structure";

const SINGLETONS = [
  { type: "navigationSettings", id: "navigationSettings", title: "Cài Đặt Menu" },
  { type: "serviceHighlightsSettings", id: "serviceHighlightsSettings", title: "Cài Đặt Dịch Vụ Nổi Bật" },
];

// Pulled out of the regular alphabetized content list below and grouped
// under "Cài Đặt" instead — Media Tag/Folder (from sanity-plugin-media) are
// a site-config concern like the two settings singletons, not editorial content.
const SETTINGS_GROUP_TYPES = [...SINGLETONS.map((s) => s.type), "media.tag", "media.folder"];

// https://www.sanity.io/docs/structure-builder-cheat-sheet
export const structure: StructureResolver = (S) =>
  S.list()
    .title("Nội dung")
    .items([
      S.listItem()
        .title("Cài Đặt")
        .child(
          S.list()
            .title("Cài Đặt")
            .items([
              ...SINGLETONS.map(({ type, id, title }) =>
                S.listItem()
                  .title(title)
                  .id(id)
                  .child(S.document().schemaType(type).documentId(id)),
              ),
              S.documentTypeListItem("media.tag"),
              S.documentTypeListItem("media.folder"),
            ]),
        ),
      S.divider(),
      ...S.documentTypeListItems()
        .filter((item) => !SETTINGS_GROUP_TYPES.includes(item.getId() ?? ""))
        .sort((a, b) => (a.getTitle() ?? "").localeCompare(b.getTitle() ?? "", "vi")),
    ]);
