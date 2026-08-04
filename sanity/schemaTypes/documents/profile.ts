import { defineField, defineType } from "sanity";

export const profileType = defineType({
  name: "profile",
  title: "Profile",
  type: "document",
  fields: [
    defineField({
      name: "fullName",
      title: "Full name",
      type: "string",
      initialValue: "Jitto Joseph",
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "birthDate",
      title: "Birth date",
      type: "date",
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "tagline",
      title: "Tagline",
      type: "string",
      description: "Use {age} as a placeholder, e.g. {age}yo Software Engineer.",
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "bio",
      title: "Bio",
      type: "text",
      rows: 3,
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "headshot",
      title: "Headshot",
      type: "image",
      options: { hotspot: true },
    }),
    defineField({
      name: "showCodeActivity",
      title: "Show code activity",
      type: "boolean",
      initialValue: true,
    }),
    defineField({
      name: "showExperienceDetails",
      title: "Show work bullets and links",
      type: "boolean",
      description: "Education always shows its details.",
      initialValue: true,
    }),
    defineField({
      name: "showExperienceDuration",
      title: "Show duration next to dates",
      type: "boolean",
      description: "For example 1 yr 3 mos.",
      initialValue: true,
    }),
    defineField({
      name: "enablePixelCompanion",
      title: "Enable pixel companion",
      type: "boolean",
      initialValue: false,
    }),
  ],
  preview: {
    select: {
      title: "fullName",
      media: "headshot",
    },
  },
});
