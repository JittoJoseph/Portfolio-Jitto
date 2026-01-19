import Link from "next/link";
import projectsData from "@/data/projects.json";
import ProjectCard from "@/components/ProjectCard";
import { ArrowLeftIcon } from "@/components/Icons";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Projects | Jitto Joseph",
  description:
    "Explore my software development projects and contributions, showcasing skills in web development, React, Next.js, and more.",
  keywords: [
    "Jitto Joseph",
    "Projects",
    "Software Projects",
    "Web Development Projects",
    "React Projects",
    "Portfolio Projects",
  ],
  openGraph: {
    title: "Projects | Jitto Joseph",
    description: "Explore my software development projects and contributions.",
    url: "https://www.jittojoseph.xyz/projects",
    siteName: "Jitto Joseph Portfolio",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Projects | Jitto Joseph",
    description: "Explore my software development projects and contributions.",
  },
};

export default function ProjectsPage() {
  return (
    <main className="min-h-screen bg-zinc-950 text-zinc-200 selection:bg-zinc-800 selection:text-zinc-100 font-sans">
      <div className="mx-auto max-w-4xl px-6 py-24 md:py-32">
        <div className="mb-16 text-center">
          <div className="inline-block rounded-full bg-white px-3 py-1 text-sm text-zinc-900 mb-4 border border-zinc-300">
            Projects & Contributions
          </div>
          <h1 className="text-4xl font-bold tracking-tight text-zinc-100 sm:text-5xl mb-4">
            My Projects
          </h1>
          <p className="text-lg text-zinc-400 max-w-2xl mx-auto">
            Here are some of my projects and contributions.
          </p>
        </div>

        <div className="mb-8">
          <Link
            href="/"
            className="text-sm text-zinc-400 hover:text-zinc-100 transition-colors flex items-center gap-2"
          >
            <ArrowLeftIcon className="h-4 w-4" />
            Back to Home
          </Link>
        </div>

        <div className="grid gap-6 sm:grid-cols-2">
          {projectsData.map((project, index) => (
            <ProjectCard key={index} project={project} />
          ))}
        </div>
      </div>
    </main>
  );
}
