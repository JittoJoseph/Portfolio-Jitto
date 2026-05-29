import { calculateAge } from "@/lib/utils";
import { getPortfolioData } from "@/lib/sanity/queries";

export const revalidate = 3600;

function formatLinks(links: { label: string; href: string }[]) {
  if (!links.length) {
    return "";
  }
  return links.map((link) => `[${link.label}](${link.href})`).join(" | ");
}

export async function GET() {
  const data = await getPortfolioData();
  const age = calculateAge(data.profile.birthDate);
  const tagline = data.profile.tagline.replace("{age}", age.toString());
  const featuredProjects = data.projects
    .filter((project) => project.kind === "personal" && project.featured)
    .slice(0, 3);
  const fallbackProjects =
    featuredProjects.length > 0
      ? featuredProjects
      : data.projects.filter((project) => project.kind === "personal").slice(0, 3);

  const lines: string[] = [];

  lines.push(
    "# Jitto Joseph — Portfolio (Markdown)",
    "This is a Markdown mirror of https://www.jittojoseph.xyz/.",
    "",
    "## Summary",
    `${tagline}`,
    `${data.profile.bio}`,
    "",
    "## Profile",
    `- Name: ${data.profile.fullName}`,
    "- Role: Software Engineer",
    `- Resume: ${data.socials.resumeUrl}`,
    "",
    "## Socials",
    `- LinkedIn: ${data.socials.linkedin}`,
    `- GitHub: ${data.socials.github}`,
    `- X: ${data.socials.x}`,
    "",
    "## Experience",
    "### Career",
  );

  for (const item of data.career) {
    const title = [item.role, item.company].filter(Boolean).join(" — ");
    const details = [item.period, item.location].filter(Boolean).join(" | ");
    lines.push(`- ${title}${details ? ` (${details})` : ""}`);
    for (const bullet of item.bullets) {
      lines.push(`  - ${bullet}`);
    }
    const links = formatLinks(item.links);
    if (links) {
      lines.push(`  - Links: ${links}`);
    }
  }

  lines.push("", "### Education");

  for (const item of data.education) {
    const title = [item.degree, item.institution].filter(Boolean).join(" — ");
    const details = [item.period, item.location].filter(Boolean).join(" | ");
    lines.push(`- ${title}${details ? ` (${details})` : ""}`);
    for (const bullet of item.bullets) {
      lines.push(`  - ${bullet}`);
    }
    const links = formatLinks(item.links);
    if (links) {
      lines.push(`  - Links: ${links}`);
    }
  }

  if (data.recognitions.length > 0) {
    lines.push("", "## Highlights");
    for (const recognition of data.recognitions) {
      const heading = `${recognition.award} — ${recognition.event}`;
      lines.push(`- ${heading}`);
      lines.push(`  - Context: ${recognition.context}`);
      lines.push(`  - Summary: ${recognition.summary}`);
      if (recognition.link) {
        lines.push(`  - Link: ${recognition.link}`);
      }
    }
  }

  lines.push("", "## Featured Projects");

  for (const project of fallbackProjects) {
    lines.push(`- ${project.title}: ${project.description}`);
    if (project.tech.length > 0) {
      lines.push(`  - Tech: ${project.tech.join(", ")}`);
    }
    const links = formatLinks(project.links);
    if (links) {
      lines.push(`  - Links: ${links}`);
    }
  }

  lines.push(
    "",
    "## Key links",
    "- Home: https://www.jittojoseph.xyz/",
    "- Projects: https://www.jittojoseph.xyz/projects",
    `- LinkedIn: ${data.socials.linkedin}`,
    `- GitHub: ${data.socials.github}`,
  );

  const content = `${lines.join("\n")}\n`;

  return new Response(content, {
    headers: {
      "Content-Type": "text/markdown; charset=utf-8",
      "Cache-Control": "public, max-age=86400",
      "X-Robots-Tag": "noindex",
    },
  });
}
