import Link from "next/link";
import type { CSSProperties } from "react";
import { getGitHubContributionActivity } from "@/lib/github/activity";

const weekdayLabels = ["", "Mon", "", "Wed", "", "Fri", ""];
const levelClasses = [
  "bg-[#161b22]",
  "bg-[#0e4429]",
  "bg-[#006d32]",
  "bg-[#26a641]",
  "bg-[#39d353]",
] as const;

export default async function GitHubActivity({
  githubProfileUrl,
}: {
  githubProfileUrl: string;
}) {
  const activity = await getGitHubContributionActivity(githubProfileUrl);

  if (!activity) {
    return (
      <Link
        href={githubProfileUrl}
        target="_blank"
        rel="noopener noreferrer"
        className="block rounded-xl border border-zinc-800 bg-zinc-900/40 p-4 sm:p-5"
      >
        <p className="text-sm text-zinc-400">
          GitHub activity is unavailable right now.
        </p>
      </Link>
    );
  }

  const graphColumns = `repeat(${activity.weeks.length}, var(--activity-cell))`;
  const activityStyle = {
    "--activity-cell": "9px",
    "--activity-gap": "2px",
  } as CSSProperties;
  const graphStyle = {
    gridTemplateColumns: graphColumns,
  } as CSSProperties;

  return (
    <Link
      href={activity.profileUrl}
      target="_blank"
      rel="noopener noreferrer"
      aria-label="Open GitHub profile"
      className="block overflow-hidden rounded-xl border border-zinc-800 bg-zinc-900/40 p-4 sm:p-5"
    >
      <div className="github-activity-scroll overflow-x-auto pb-2">
        <div className="min-w-max" style={activityStyle}>
          <div
            className="mb-2 grid pl-8 text-[10px] leading-none text-zinc-500 sm:text-[11px]"
            style={{
              ...graphStyle,
              columnGap: "var(--activity-gap)",
            }}
          >
            {activity.monthLabels.map((month) => (
              <span
                key={`${month.label}-${month.weekIndex}`}
                style={{ gridColumnStart: month.weekIndex + 1 }}
              >
                {month.label}
              </span>
            ))}
          </div>

          <div className="flex gap-2">
            <div
              className="grid w-6 text-[10px] text-zinc-500 sm:text-[11px]"
              style={{
                gridTemplateRows: "repeat(7, var(--activity-cell))",
                rowGap: "var(--activity-gap)",
              } as CSSProperties}
            >
              {weekdayLabels.map((label, index) => (
                <span
                  key={`${label}-${index}`}
                  className="flex items-center leading-none"
                >
                  {label}
                </span>
              ))}
            </div>

            <div
              className="grid"
              style={{
                ...graphStyle,
                columnGap: "var(--activity-gap)",
              }}
            >
              {activity.weeks.map((week, weekIndex) => (
                <div
                  key={`week-${weekIndex}`}
                  className="grid"
                  style={{
                    gridTemplateRows: "repeat(7, var(--activity-cell))",
                    rowGap: "var(--activity-gap)",
                  } as CSSProperties}
                >
                  {week.map((day, dayIndex) => (
                    <span
                      key={day ? day.date : `empty-${weekIndex}-${dayIndex}`}
                      className={`block rounded-[2px] ${day ? levelClasses[day.level] : levelClasses[0]}`}
                      style={{
                        width: "var(--activity-cell)",
                        height: "var(--activity-cell)",
                      }}
                    />
                  ))}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </Link>
  );
}
