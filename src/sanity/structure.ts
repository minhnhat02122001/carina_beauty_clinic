import type { StructureResolver } from "sanity/structure";

const SINGLETON_TYPE = "navigationSettings";
const SINGLETON_ID = "navigationSettings";

// https://www.sanity.io/docs/structure-builder-cheat-sheet
export const structure: StructureResolver = (S) =>
  S.list()
    .title("Nội dung")
    .items([
      S.listItem()
        .title("Cài Đặt Menu")
        .id(SINGLETON_ID)
        .child(S.document().schemaType(SINGLETON_TYPE).documentId(SINGLETON_ID)),
      S.divider(),
      ...S.documentTypeListItems().filter((item) => item.getId() !== SINGLETON_TYPE),
    ]);
