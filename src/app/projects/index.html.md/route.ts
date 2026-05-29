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
  const personalProjects = data.projects.filter(
    (project) => project.kind === "personal",
  );
  const freelanceProjects = data.projects.filter(
    (project) => project.kind === "freelance",
  );

  const lines: string[] = [];

  lines.push(
    "# Projects — Jitto Joseph (Markdown)",
    "This is a Markdown mirror of https://www.jittojoseph.xyz/projects.",
    "",
    "## Summary",
    "Project showcase featuring personal/open-source work and freelance/client projects.",
  );

  if (personalProjects.length > 0) {
    lines.push("", "## Personal & Open Source");
    for (const project of personalProjects) {
      lines.push(`- ${project.title}: ${project.description}`);
      if (project.tech.length > 0) {
        lines.push(`  - Tech: ${project.tech.join(", ")}`);
      }
      const links = formatLinks(project.links);
      if (links) {
        lines.push(`  - Links: ${links}`);
      }
    }
  }

  if (freelanceProjects.length > 0) {
    lines.push("", "## Freelance & Client Work");
    for (const project of freelanceProjects) {
      lines.push(`- ${project.title}: ${project.description}`);
      if (project.tech.length > 0) {
        lines.push(`  - Tech: ${project.tech.join(", ")}`);
      }
      const links = formatLinks(project.links);
      if (links) {
        lines.push(`  - Links: ${links}`);
      }
    }
  }

  lines.push(
    "",
    "## Key links",
    "- Projects: https://www.jittojoseph.xyz/projects",
    "- Home: https://www.jittojoseph.xyz/",
    `- LinkedIn: ${data.socials.linkedin}`,
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
