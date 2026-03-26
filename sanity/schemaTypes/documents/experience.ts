import { defineArrayMember, defineField, defineType } from "sanity";

export const experienceType = defineType({
  name: "experience",
  title: "Experience",
  type: "document",
  fields: [
    defineField({
      name: "kind",
      title: "Kind",
      type: "string",
      options: {
        list: [
          { title: "Career", value: "career" },
          { title: "Education", value: "education" },
        ],
        layout: "radio",
      },
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "company",
      title: "Company",
      type: "string",
      hidden: ({ document }) => document?.kind !== "career",
    }),
    defineField({
      name: "institution",
      title: "Institution",
      type: "string",
      hidden: ({ document }) => document?.kind !== "education",
    }),
    defineField({
      name: "role",
      title: "Role",
      type: "string",
      hidden: ({ document }) => document?.kind !== "career",
    }),
    defineField({
      name: "degree",
      title: "Degree",
      type: "string",
      hidden: ({ document }) => document?.kind !== "education",
    }),
    defineField({
      name: "period",
      title: "Period",
      type: "string",
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "image",
      title: "Logo / image",
      type: "image",
      options: { hotspot: true },
    }),
    defineField({
      name: "bullets",
      title: "Bullets",
      type: "array",
      of: [defineArrayMember({ type: "string" })],
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "links",
      title: "Links",
      type: "array",
      of: [defineArrayMember({ type: "link" })],
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "orderRank",
      title: "Sort order",
      type: "number",
      validation: (rule) => rule.required().integer().min(0),
      initialValue: 0,
    }),
  ],
  orderings: [
    {
      title: "Sort order",
      name: "orderRank",
      by: [{ field: "orderRank", direction: "asc" }],
    },
  ],
  preview: {
    select: {
      company: "company",
      institution: "institution",
      kind: "kind",
      media: "image",
    },
    prepare(selection) {
      return {
        title: selection.company || selection.institution || "Experience item",
        subtitle: selection.kind,
        media: selection.media,
      };
    },
  },
});
