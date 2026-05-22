import Link from "next/link";
import type { GitHubContributionActivity } from "@/lib/github/activity";
import GitHubActivityGrid from "@/components/GitHubActivityGrid";

export default async function GitHubActivity({
  githubProfileUrl,
  activity,
}: {
  githubProfileUrl: string;
  activity: GitHubContributionActivity | null;
}) {
  if (!activity) {
    return (
      <Link
        href={githubProfileUrl}
        target="_blank"
        rel="noopener noreferrer"
        className="block rounded-xl py-1"
      >
        <p className="text-sm text-zinc-400">
          GitHub activity is unavailable right now.
        </p>
      </Link>
    );
  }

  return (
    <Link
      href={activity.profileUrl}
      target="_blank"
      rel="noopener noreferrer"
      aria-label="Open GitHub profile"
      className="block overflow-hidden rounded-xl py-1"
    >
      <div className="github-activity-scroll overflow-x-auto pb-2">
        <div className="w-full flex justify-center">
          <GitHubActivityGrid activity={activity} />
        </div>
      </div>
    </Link>
  );
}
