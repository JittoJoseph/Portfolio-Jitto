import { defineField, defineType } from "sanity";

export const linkObject = defineType({
  name: "link",
  title: "Link",
  type: "object",
  fields: [
    defineField({
      name: "label",
      title: "Label",
      type: "string",
      validation: (rule) => rule.required().min(1),
    }),
    defineField({
      name: "href",
      title: "URL",
      type: "url",
      validation: (rule) =>
        rule.required().uri({
          allowRelative: false,
          scheme: ["http", "https", "mailto", "tel"],
        }),
    }),
    defineField({
      name: "icon",
      title: "Icon",
      type: "string",
      options: {
        list: [
          { title: "GitHub", value: "github" },
          { title: "Globe", value: "globe" },
          { title: "LinkedIn", value: "linkedin" },
          { title: "Link", value: "link" },
        ],
      },
    }),
  ],
});
