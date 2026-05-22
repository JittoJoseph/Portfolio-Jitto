import Link from "next/link";
import { getGitHubContributionActivity } from "@/lib/github/activity";
import GitHubActivityGrid from "@/components/GitHubActivityGrid";

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
        className="block rounded-xl py-1"
      >
        <p className="text-sm text-zinc-400">
          GitHub activity is unavailable right now.
        </p>
      </Link>
    );
  }

  const cellSize = 9;
  const gapSize = 2;
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
