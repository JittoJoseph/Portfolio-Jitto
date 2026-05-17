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
    defineField({
      name: "showCodeActivity",
      title: "Show code activity section",
      type: "boolean",
      description:
        "Enable or disable the GitHub code activity section on the landing page.",
      initialValue: true,
    }),
    defineField({
      name: "showExperienceDetails",
      title: "Show work experience bullets and links",
      type: "boolean",
      description:
        "When disabled, work experience items show only the header and link to the first configured link. Education is not affected.",
      initialValue: true,
    }),
  ],
  preview: {
    select: {
      title: "fullName",
      media: "headshot",
    },
  },
});
