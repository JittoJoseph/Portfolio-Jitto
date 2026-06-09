import { defineArrayMember, defineField, defineType } from "sanity";
import { orderRankField, orderRankOrdering } from "@sanity/orderable-document-list";

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
      name: "location",
      title: "Location",
      description: "Optional free-form location, for example Remote, California, United States, or Bengaluru - Hybrid.",
      type: "string",
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
    }),
    defineField({
      name: "links",
      title: "Links",
      type: "array",
      of: [defineArrayMember({ type: "link" })],
    }),
    orderRankField({ type: "experience" }),
  ],
  orderings: [orderRankOrdering],
  preview: {
    select: {
      company: "company",
      institution: "institution",
      kind: "kind",
      period: "period",
      location: "location",
      media: "image",
    },
    prepare(selection) {
      return {
        title: selection.company || selection.institution || "Experience item",
        subtitle: [selection.kind, selection.period, selection.location]
          .filter(Boolean)
          .join(" | "),
        media: selection.media,
      };
    },
  },
});
