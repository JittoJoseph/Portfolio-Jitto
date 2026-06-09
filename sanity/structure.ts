import type { StructureResolver } from "sanity/structure";
import { orderableDocumentListDeskItem } from "@sanity/orderable-document-list";

export const structure: StructureResolver = (S, context) =>
  S.list()
    .title("Content")
    .items([
      S.listItem()
        .title("Profile")
        .id("profileSingleton")
        .child(
          S.document()
            .schemaType("profile")
            .documentId("profile-main")
            .views([S.view.form()]),
        ),
      S.listItem()
        .title("Social Links")
        .id("socialsSingleton")
        .child(
          S.document()
            .schemaType("socials")
            .documentId("socials-main")
            .views([S.view.form()]),
        ),
      S.divider(),
      orderableDocumentListDeskItem({ type: "project", title: "Projects", S, context }),
      orderableDocumentListDeskItem({ type: "experience", title: "Experience", S, context }),
      orderableDocumentListDeskItem({ type: "recognition", title: "Recognition", S, context }),
    ]);
