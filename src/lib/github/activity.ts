type ContributionLevel = 0 | 1 | 2 | 3 | 4;

type ContributionDay = {
  date: string;
  level: ContributionLevel;
  count: number;
};

type ContributionWeek = Array<ContributionDay | null>;

type MonthLabel = {
  label: string;
  weekIndex: number;
};

export type GitHubContributionActivity = {
  profileUrl: string;
  weeks: ContributionWeek[];
  monthLabels: MonthLabel[];
};

const DAYS_IN_WEEK = 7;

const toIsoDate = (date: Date) => date.toISOString().slice(0, 10);

function parseContributionCount(text: string): number {
  const trimmed = text.trim();

  if (trimmed.toLowerCase().startsWith("no ")) {
    return 0;
  }

  const match = trimmed.match(/^(\d+)\s+contribution/);
  return match ? Number.parseInt(match[1], 10) : 0;
}

function parseGitHubUsername(profileUrl: string): string | null {
  const match = profileUrl.match(
    /^https?:\/\/(?:www\.)?github\.com\/([^/?#]+)/i,
  );

  return match?.[1] ?? null;
}

function emptyWeek(): ContributionWeek {
  return Array.from({ length: DAYS_IN_WEEK }, () => null);
}

function buildWeeks(days: ContributionDay[]): ContributionWeek[] {
  const dayByDate = new Map(days.map((day) => [day.date, day]));
  const sortedDates = [...dayByDate.keys()].sort((a, b) => a.localeCompare(b));

  const firstDate = new Date(`${sortedDates[0]}T00:00:00Z`);
  const lastDate = new Date(`${sortedDates[sortedDates.length - 1]}T00:00:00Z`);

  const weeks: ContributionWeek[] = [];
  let currentWeek = emptyWeek();
  const cursor = new Date(firstDate);

  while (cursor <= lastDate) {
    const dayIndex = cursor.getUTCDay();

    if (dayIndex === 0 && currentWeek.some((day) => day !== null)) {
      weeks.push(currentWeek);
      currentWeek = emptyWeek();
    }

    const date = toIsoDate(cursor);
    currentWeek[dayIndex] = dayByDate.get(date) ?? null;
    cursor.setUTCDate(cursor.getUTCDate() + 1);
  }

  if (currentWeek.some((day) => day !== null)) {
    weeks.push(currentWeek);
  }

  return weeks;
}

function buildMonthLabels(weeks: ContributionWeek[]): MonthLabel[] {
  const labels: MonthLabel[] = [];
  let previousMonthKey = "";
  const minimumWeekGap = 4;
  let lastLabelWeekIndex = -minimumWeekGap;

  for (let weekIndex = 0; weekIndex < weeks.length; weekIndex += 1) {
    const firstDayInWeek = weeks[weekIndex].find((day) => day !== null);

    if (!firstDayInWeek) {
      continue;
    }

    const date = new Date(`${firstDayInWeek.date}T00:00:00Z`);
    const monthKey = `${date.getUTCFullYear()}-${date.getUTCMonth()}`;

    if (monthKey === previousMonthKey) {
      continue;
    }

    if (weekIndex - lastLabelWeekIndex < minimumWeekGap) {
      continue;
    }

    labels.push({
      label: date.toLocaleString("en-US", { month: "short", timeZone: "UTC" }),
      weekIndex,
    });
    previousMonthKey = monthKey;
    lastLabelWeekIndex = weekIndex;
  }

  // Remove duplicate month labels, keeping only the last occurrence
  return labels.filter((label, index, array) => {
    return !array.some(
      (otherLabel, otherIndex) =>
        otherIndex > index && otherLabel.label === label.label,
    );
  });
}

export async function getGitHubContributionActivity(
  profileUrl: string,
): Promise<GitHubContributionActivity | null> {
  const username = parseGitHubUsername(profileUrl);

  if (!username) {
    return null;
  }

  try {
    const response = await fetch(
      `https://github.com/users/${username}/contributions`,
      {
        headers: {
          "User-Agent": "portfolio-website",
        },
        next: {
          revalidate: 3600,
          tags: [`github-activity:${username}`],
        },
      },
    );

    if (!response.ok) {
      return null;
    }

    const html = await response.text();

    const tooltipRegex =
      /<tool-tip[^>]*\bfor="([^"]+)"[^>]*>([^<]*)<\/tool-tip>/g;
    const countsById = new Map<string, number>();
    let tooltipMatch: RegExpExecArray | null = tooltipRegex.exec(html);

    while (tooltipMatch) {
      const [, id, text] = tooltipMatch;
      countsById.set(id, parseContributionCount(text));
      tooltipMatch = tooltipRegex.exec(html);
    }

    const cellRegex = /<td[^>]*\bdata-date="[^"]+"[^>]*>/g;
    const days: ContributionDay[] = [];
    let cellMatch: RegExpExecArray | null = cellRegex.exec(html);

    while (cellMatch) {
      const cell = cellMatch[0];
      const dateMatch = cell.match(/\bdata-date="([^"]+)"/);
      const levelMatch = cell.match(/\bdata-level="([0-4])"/);

      if (!dateMatch || !levelMatch) {
        cellMatch = cellRegex.exec(html);
        continue;
      }

      const countMatch = cell.match(/\bdata-count="([0-9]+)"/);
      const idMatch = cell.match(/\bid="([^"]+)"/);
      const level = Number.parseInt(levelMatch[1], 10) as ContributionLevel;
      const count = countMatch
        ? Number.parseInt(countMatch[1], 10)
        : idMatch
          ? (countsById.get(idMatch[1]) ?? 0)
          : 0;

      days.push({ date: dateMatch[1], level, count });
      cellMatch = cellRegex.exec(html);
    }

    if (days.length === 0) {
      return null;
    }

    days.sort((a, b) => a.date.localeCompare(b.date));

    const weeks = buildWeeks(days);
    const monthLabels = buildMonthLabels(weeks);

    return {
      profileUrl: `https://github.com/${username}`,
      weeks,
      monthLabels,
    };
  } catch (error) {
    console.error("Failed to fetch GitHub contribution activity:", error);
    return null;
  }
}
