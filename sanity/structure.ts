import type { StructureResolver } from "sanity/structure";

export const structure: StructureResolver = (S) =>
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
            .views([S.view.form()])
        ),
      S.listItem()
        .title("Social Links")
        .id("socialsSingleton")
        .child(
          S.document()
            .schemaType("socials")
            .documentId("socials-main")
            .views([S.view.form()])
        ),
      S.divider(),
      S.listItem()
        .title("Projects")
        .schemaType("project")
        .child(S.documentTypeList("project").title("Projects")),
      S.listItem()
        .title("Experience")
        .schemaType("experience")
        .child(S.documentTypeList("experience").title("Experience")),
    ]);
