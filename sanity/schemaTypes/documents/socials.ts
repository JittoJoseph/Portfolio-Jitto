import { defineField, defineType } from "sanity";

export const socialsType = defineType({
  name: "socials",
  title: "Social Links",
  type: "document",
  fields: [
    defineField({
      name: "email",
      title: "Email",
      type: "string",
      validation: (rule) => rule.required().email(),
    }),
    defineField({
      name: "linkedin",
      title: "LinkedIn",
      type: "url",
      validation: (rule) => rule.required().uri({ scheme: ["https"] }),
    }),
    defineField({
      name: "github",
      title: "GitHub",
      type: "url",
      validation: (rule) => rule.required().uri({ scheme: ["https"] }),
    }),
    defineField({
      name: "x",
      title: "X (Twitter)",
      type: "url",
      validation: (rule) => rule.required().uri({ scheme: ["https"] }),
    }),
    defineField({
      name: "resumeFile",
      title: "Resume PDF",
      type: "file",
      options: {
        accept: "application/pdf",
      },
      validation: (rule) => rule.required(),
    }),
  ],
});
