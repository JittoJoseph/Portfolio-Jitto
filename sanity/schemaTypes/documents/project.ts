import { defineArrayMember, defineField, defineType } from "sanity";
import { orderRankField, orderRankOrdering } from "@sanity/orderable-document-list";

export const projectType = defineType({
  name: "project",
  title: "Project",
  type: "document",
  fields: [
    defineField({
      name: "title",
      title: "Title",
      type: "string",
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "slug",
      title: "Slug",
      type: "slug",
      options: { source: "title", maxLength: 96 },
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "kind",
      title: "Kind",
      type: "string",
      options: {
        list: [
          { title: "Personal / Open Source", value: "personal" },
          { title: "Freelance / Client", value: "freelance" },
        ],
        layout: "radio",
      },
      initialValue: "personal",
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "description",
      title: "Description",
      type: "text",
      rows: 3,
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "image",
      title: "Project image",
      type: "image",
      options: { hotspot: true },
    }),
    defineField({
      name: "tech",
      title: "Tech stack",
      type: "array",
      of: [defineArrayMember({ type: "string" })],
      validation: (rule) => rule.required().min(1),
    }),
    defineField({
      name: "links",
      title: "Links",
      type: "array",
      of: [defineArrayMember({ type: "link" })],
      validation: (rule) => rule.required().min(1),
    }),
    defineField({
      name: "featured",
      title: "Featured on homepage",
      type: "boolean",
      initialValue: false,
    }),
    defineField({
      name: "isHidden",
      title: "Hide this project",
      description: "Toggle this on to hide this project from the live website.",
      type: "boolean",
      initialValue: false,
    }),
    orderRankField({ type: "project" }),
  ],
  preview: {
    select: {
      title: "title",
      subtitle: "kind",
      media: "image",
    },
  },
});
