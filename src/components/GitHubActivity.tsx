import Link from "next/link";
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

  const graphColumns = `repeat(${activity.weeks.length}, minmax(0, 1fr))`;

  return (
    <Link
      href={activity.profileUrl}
      target="_blank"
      rel="noopener noreferrer"
      aria-label="Open GitHub profile"
      className="block overflow-hidden rounded-xl border border-zinc-800 bg-zinc-900/40 p-4 sm:p-5"
    >
      <div
        className="mb-2 grid min-w-0 gap-[2px] pl-7 text-[10px] leading-none text-zinc-500 sm:pl-8 sm:text-[11px]"
        style={{ gridTemplateColumns: graphColumns }}
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

      <div className="flex min-w-0 gap-2">
        <div className="grid grid-rows-7 text-[10px] leading-[10px] text-zinc-500 sm:text-[11px] sm:leading-[11px]">
          {weekdayLabels.map((label, index) => (
            <span key={`${label}-${index}`} className="h-[10px] sm:h-[11px]">
              {label}
            </span>
          ))}
        </div>

        <div
          className="grid min-w-0 flex-1 gap-[2px]"
          style={{ gridTemplateColumns: graphColumns }}
        >
          {activity.weeks.map((week, weekIndex) => (
            <div
              key={`week-${weekIndex}`}
              className="grid min-w-0 grid-rows-7 gap-[2px]"
            >
              {week.map((day, dayIndex) => (
                <span
                  key={day ? day.date : `empty-${weekIndex}-${dayIndex}`}
                  className={`aspect-square w-full rounded-[2px] ${day ? levelClasses[day.level] : levelClasses[0]}`}
                />
              ))}
            </div>
          ))}
        </div>
      </div>
    </Link>
  );
}
