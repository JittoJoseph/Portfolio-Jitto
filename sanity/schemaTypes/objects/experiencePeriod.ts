import { defineField, defineType } from "sanity";
import {
  MONTH_LABELS,
  formatPeriod,
  type ExperiencePeriod,
} from "../../../src/lib/experiencePeriod";

const monthOptions = MONTH_LABELS.map((title, index) => ({
  title,
  value: index + 1,
}));

const isOngoing = (parent: unknown) =>
  Boolean((parent as ExperiencePeriod | undefined)?.isPresent);

export const experiencePeriodObject = defineType({
  name: "experiencePeriod",
  title: "Period",
  type: "object",
  fieldsets: [
    { name: "from", title: "From", options: { columns: 2 } },
    { name: "to", title: "To", options: { columns: 2 } },
  ],
  fields: [
    defineField({
      name: "startMonth",
      title: "Month",
      type: "number",
      fieldset: "from",
      options: { list: monthOptions },
    }),
    defineField({
      name: "startYear",
      title: "Year",
      type: "number",
      fieldset: "from",
      validation: (rule) => rule.integer().min(1900).max(2100),
    }),
    defineField({
      name: "isPresent",
      title: "Currently ongoing (shows “Present”)",
      type: "boolean",
      initialValue: false,
    }),
    defineField({
      name: "endMonth",
      title: "Month",
      type: "number",
      fieldset: "to",
      options: { list: monthOptions },
      hidden: ({ parent }) => isOngoing(parent),
    }),
    defineField({
      name: "endYear",
      title: "Year",
      type: "number",
      fieldset: "to",
      hidden: ({ parent }) => isOngoing(parent),
      validation: (rule) => rule.integer().min(1900).max(2100),
    }),
  ],
  validation: (rule) =>
    rule.custom((value?: ExperiencePeriod) => {
      if (!value) return true;

      const { startMonth, startYear, endMonth, endYear, isPresent } = value;

      if (startMonth && !startYear) {
        return {
          message: "Pick a year to go with this month.",
          paths: [["startMonth"]],
        };
      }

      if (isPresent) return true;

      if (endMonth && !endYear) {
        return {
          message: "Pick a year to go with this month.",
          paths: [["endMonth"]],
        };
      }

      if (
        startYear &&
        endYear &&
        endYear * 12 + (endMonth ?? 12) < startYear * 12 + (startMonth ?? 1)
      ) {
        return "The end date is before the start date.";
      }

      return true;
    }),
});

export function describePeriod(period?: ExperiencePeriod | null) {
  const { range, duration } = formatPeriod(period);
  if (!range) return null;
  return duration ? `${range} · ${duration}` : range;
}
