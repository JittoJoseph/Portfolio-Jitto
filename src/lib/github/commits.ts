import { parseGitHubUsername } from "./activity";

export type CommitData = {
  sha: string;
  message: string;
  url: string;
  repo: string;
  createdAt: string;
  additions?: number;
  deletions?: number;
};

export async function getLatestCommits(
  profileUrl: string,
): Promise<CommitData[]> {
  const username = parseGitHubUsername(profileUrl);

  if (!username) {
    return [];
  }

  try {
    const response = await fetch(
      `https://api.github.com/search/commits?q=author:${username}&sort=author-date&order=desc`,
      {
        headers: {
          "User-Agent": "portfolio-website",
        },
        next: {
          revalidate: 60, // 60 seconds
          tags: [`github-commits:${username}`],
        },
      },
    );

    if (!response.ok) {
      return [];
    }

    const data = await response.json();
    const commits: CommitData[] = [];

    if (data.items) {
      for (const item of data.items) {
        let additions = 0;
        let deletions = 0;

        try {
          // Fetch the patch to get stats without hitting API limits
          const patchRes = await fetch(`https://github.com/${item.repository.full_name}/commit/${item.sha}.patch`, {
            headers: { "User-Agent": "portfolio-website" },
            next: { revalidate: 60, tags: [`github-commit-patch:${item.sha}`] }
          });
          
          if (patchRes.ok) {
            const patchText = await patchRes.text();
            const insMatch = patchText.match(/(\d+)\s+insertions?\(\+\)/);
            const delMatch = patchText.match(/(\d+)\s+deletions?\(-\)/);
            
            if (insMatch) additions = parseInt(insMatch[1], 10);
            if (delMatch) deletions = parseInt(delMatch[1], 10);
          }
        } catch (e) {
          console.error("Failed to fetch patch stats", e);
        }

        commits.push({
          sha: item.sha,
          message: item.commit.message.split("\n")[0],
          url: item.html_url,
          repo: item.repository.name,
          createdAt: item.commit.author.date,
          additions,
          deletions,
        });

        if (commits.length >= 3) {
          break;
        }
      }
    }

    return commits;
  } catch (error) {
    console.error("Failed to fetch GitHub commits:", error);
    return [];
  }
}
