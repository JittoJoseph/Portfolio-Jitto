export const MONTH_LABELS = [
  "Jan",
  "Feb",
  "Mar",
  "Apr",
  "May",
  "Jun",
  "Jul",
  "Aug",
  "Sep",
  "Oct",
  "Nov",
  "Dec",
] as const;

export type ExperiencePeriod = {
  startMonth?: number | null;
  startYear?: number | null;
  endMonth?: number | null;
  endYear?: number | null;
  isPresent?: boolean | null;
};

function toYear(value?: number | null): number | null {
  return typeof value === "number" && value > 0 ? Math.trunc(value) : null;
}

function toMonth(value?: number | null): number | null {
  return typeof value === "number" && value >= 1 && value <= 12
    ? Math.trunc(value)
    : null;
}

function formatPoint(month: number | null, year: number | null): string | null {
  if (!year) return null;
  return month ? `${MONTH_LABELS[month - 1]} ${year}` : `${year}`;
}

function formatUnits(value: number, singular: string, plural: string): string {
  return `${value} ${value === 1 ? singular : plural}`;
}

export function formatPeriodRange(period?: ExperiencePeriod | null): string | null {
  if (!period) return null;

  const start = formatPoint(toMonth(period.startMonth), toYear(period.startYear));

  if (period.isPresent) return start ? `${start} - Present` : "Present";

  const end = formatPoint(toMonth(period.endMonth), toYear(period.endYear));

  if (start && end) return `${start} - ${end}`;
  if (start) return start;
  if (end) return `Until ${end}`;
  return null;
}

export function formatPeriodDuration(
  period?: ExperiencePeriod | null,
  now: Date = new Date(),
): string | null {
  if (!period) return null;

  const startYear = toYear(period.startYear);
  const endYear = period.isPresent ? now.getFullYear() : toYear(period.endYear);
  if (!startYear || !endYear) return null;

  const startMonth = toMonth(period.startMonth);
  const endMonth = period.isPresent ? now.getMonth() + 1 : toMonth(period.endMonth);

  if (!startMonth || !endMonth) {
    const years = endYear - startYear;
    return years >= 1 ? formatUnits(years, "yr", "yrs") : null;
  }

  const totalMonths = (endYear - startYear) * 12 + (endMonth - startMonth) + 1;
  if (totalMonths < 1) return null;

  const years = Math.floor(totalMonths / 12);
  const months = totalMonths % 12;

  return [
    years > 0 ? formatUnits(years, "yr", "yrs") : null,
    months > 0 ? formatUnits(months, "mo", "mos") : null,
  ]
    .filter(Boolean)
    .join(" ");
}

export function formatPeriod(period?: ExperiencePeriod | null, now?: Date) {
  const range = formatPeriodRange(period);

  return {
    range: range ?? undefined,
    duration: range ? (formatPeriodDuration(period, now) ?? undefined) : undefined,
  };
}
