import { defineField, defineType } from "sanity";
import { orderRankField, orderRankOrdering } from "@sanity/orderable-document-list";

export const recognitionType = defineType({
  name: "recognition",
  title: "Recognition",
  type: "document",
  fields: [
    defineField({
      name: "event",
      title: "Event / Program",
      type: "string",
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "award",
      title: "Award / Outcome",
      type: "string",
      description: "Example: 1st Place, Global Nominee, Awardee.",
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "context",
      title: "Edition / Context",
      type: "string",
      description: "Example: DMCON 2025, gradCapital 2024, 2025.",
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "summary",
      title: "One-line summary",
      type: "text",
      rows: 2,
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "link",
      title: "Link",
      type: "url",
      description: "Optional. If set, the card links to this URL.",
      validation: (rule) => rule.uri({ scheme: ["http", "https"] }),
    }),
    defineField({
      name: "image",
      title: "Recognition image",
      type: "image",
      options: { hotspot: true },
      validation: (rule) => rule.required(),
    }),
    orderRankField({ type: "recognition" }),
  ],
  preview: {
    select: {
      title: "event",
      award: "award",
      context: "context",
      media: "image",
    },
    prepare(selection) {
      return {
        title: selection.title || "Recognition",
        subtitle: [selection.award, selection.context]
          .filter(Boolean)
          .join(" | "),
        media: selection.media,
      };
    },
  },
});
