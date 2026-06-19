import Link from "next/link";
import { type CommitData } from "@/lib/github/commits";
import { timeAgo } from "@/lib/utils";

type LatestCommitsProps = {
  commits: CommitData[];
};

export default function LatestCommits({ commits }: LatestCommitsProps) {
  if (!commits || commits.length === 0) return null;

  return (
    <div className="rounded-xl border border-zinc-800/60 bg-[#0c0c0e] p-5 font-mono">
      <div className="mb-5 flex items-center justify-between">
        <h3 className="text-xs font-medium uppercase tracking-wider text-zinc-500">
          Latest Commits
        </h3>
      </div>

      {/* Fade out mask container */}
      <div className="relative [mask-image:linear-gradient(to_bottom,white_20%,transparent_100%)] pb-2">
        <div className="flex flex-col gap-4">
          {commits.map((commit, index) => {
            const shortSha = commit.sha.substring(0, 7);
            return (
              <Link
                key={commit.sha}
                href={commit.url}
                target="_blank"
                rel="noopener noreferrer"
                className="group relative pl-4 transition-all hover:pl-5"
              >
                {/* Branch line effect */}
                <div className="absolute left-0 top-1.5 bottom-[-1rem] w-px bg-zinc-800 group-last:bottom-0"></div>
                {/* Commit dot */}
                <div className="absolute left-[-3px] top-1.5 h-1.5 w-1.5 rounded-full bg-zinc-600 ring-4 ring-[#0c0c0e] group-hover:bg-zinc-300 transition-colors"></div>

                <div className="flex flex-col gap-1.5">
                  <div className="flex items-center gap-2 text-xs">
                    <span className="text-emerald-400/90 font-medium">{shortSha}</span>
                    <span className="text-zinc-600">in</span>
                    <span className="text-zinc-400">{commit.repo.split('/')[1] || commit.repo}</span>
                    
                    {/* Stats */}
                    {(!!commit.additions || !!commit.deletions) && (
                      <div className="flex items-center gap-1.5 ml-1">
                        {!!commit.additions && <span className="text-emerald-500/90">+{commit.additions}</span>}
                        {!!commit.deletions && <span className="text-red-500/90">-{commit.deletions}</span>}
                      </div>
                    )}

                    <span className="text-zinc-600 ml-auto">{timeAgo(commit.createdAt)}</span>
                  </div>
                  <p className="text-sm text-zinc-300 line-clamp-1 group-hover:text-zinc-100 transition-colors font-sans">
                    {commit.message}
                  </p>
                </div>
              </Link>
            );
          })}
        </div>
      </div>
    </div>
  );
}
