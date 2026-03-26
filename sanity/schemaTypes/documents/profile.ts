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
      description: "Use {age} placeholder (e.g. {age}yo Software Engineer...)",
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
  ],
  preview: {
    select: {
      title: "fullName",
      media: "headshot",
    },
  },
});
