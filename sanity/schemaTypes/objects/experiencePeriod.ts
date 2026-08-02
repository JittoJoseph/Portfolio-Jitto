import { defineField, defineType } from "sanity";
import { ExperiencePeriodInput } from "../../components/ExperiencePeriodInput";
import { formatPeriod, type ExperiencePeriod } from "../../../src/lib/experiencePeriod";

export const experiencePeriodObject = defineType({
  name: "experiencePeriod",
  title: "Period",
  type: "object",
  components: { input: ExperiencePeriodInput },
  fields: [
    defineField({ name: "startMonth", type: "number" }),
    defineField({ name: "startYear", type: "number" }),
    defineField({ name: "endMonth", type: "number" }),
    defineField({ name: "endYear", type: "number" }),
    defineField({ name: "isPresent", type: "boolean" }),
  ],
  validation: (rule) =>
    rule.custom((value?: ExperiencePeriod) => {
      if (!value) return true;

      const { startMonth, startYear, endMonth, endYear, isPresent } = value;

      if (
        !isPresent &&
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
