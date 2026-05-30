import { calculateAge } from "@/lib/utils";
import { getPortfolioData } from "@/lib/sanity/queries";

export const revalidate = 3600;

function formatLink(label: string, url: string, note?: string) {
  return `- [${label}](${url})${note ? `: ${note}` : ""}`;
}

export async function GET() {
  const data = await getPortfolioData();
  const age = calculateAge(data.profile.birthDate);
  const tagline = data.profile.tagline.replace("{age}", age.toString());

  const content = `# Jitto Joseph Portfolio
> LLM-friendly index for https://www.jittojoseph.xyz.

This site has two primary pages. Use the Markdown mirrors for the full, structured content including experience, education, recognitions, project lists, and social links.

## Pages
${formatLink(
  "Home (Markdown)",
  "https://www.jittojoseph.xyz/index.html.md",
  `Profile, tagline (${tagline}), experience, highlights, and contact links.`,
)}
${formatLink(
  "Projects (Markdown)",
  "https://www.jittojoseph.xyz/projects.md",
  "Personal/open-source and freelance projects with descriptions, tech, and links.",
)}

## Optional
${formatLink(
  "Home (HTML)",
  "https://www.jittojoseph.xyz/",
  "Visual homepage.",
)}
${formatLink(
  "Projects (HTML)",
  "https://www.jittojoseph.xyz/projects",
  "Visual projects page.",
)}
${formatLink(
  "LinkedIn",
  data.socials.linkedin,
  "Primary social profile.",
)}
${formatLink("GitHub", data.socials.github, "Open-source repositories.")}
${formatLink("Resume", data.socials.resumeUrl, "Latest resume.")}
${formatLink(
  "Sitemap",
  "https://www.jittojoseph.xyz/sitemap.xml",
  "Indexable pages.",
)}
${formatLink(
  "Robots",
  "https://www.jittojoseph.xyz/robots.txt",
  "Crawl rules.",
)}
`;

  return new Response(content, {
    headers: {
      "Content-Type": "text/plain; charset=utf-8",
      "Cache-Control": "public, max-age=86400",
      "X-Robots-Tag": "noindex",
    },
  });
}
