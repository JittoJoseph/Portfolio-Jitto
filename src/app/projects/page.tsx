import Link from "next/link";
import projectsData from "@/data/projects.json";
import freelanceData from "@/data/freelance-projects.json";
import { ArrowLeftIcon, GitHubIcon, LinkedInIcon } from "@/components/Icons";
import ProjectCard from "@/components/ProjectCard";
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
      <div className="mx-auto max-w-3xl px-6 pt-14 pb-16">
        {/* Page heading */}
        <div className="mb-10">
          {/* Back link */}
          <Link
            href="/"
            className="inline-flex items-center gap-1.5 text-xs font-medium text-zinc-600 hover:text-zinc-300 transition-colors mb-8"
          >
            <ArrowLeftIcon className="h-3.5 w-3.5" />
            Back to Home
          </Link>

          {/* Title */}
          <div className="mb-6">
            <p className="text-[10px] font-mono uppercase tracking-widest text-zinc-600 mb-2">
              Portfolio
            </p>
            <h1 className="text-2xl font-bold tracking-tight text-white">
              Projects &amp; Contributions
            </h1>
          </div>

          {/* Section nav */}
          <div className="flex items-center gap-2 border-t border-zinc-800/60 pt-6">
            <a
              href="#personal"
              className="inline-flex items-center gap-1.5 rounded-full bg-zinc-800/80 border border-zinc-700/60 px-4 py-1.5 text-xs font-medium text-zinc-300 hover:bg-zinc-700/80 hover:text-white transition-all"
            >
              Personal
            </a>
            <a
              href="#freelance"
              className="inline-flex items-center gap-1.5 rounded-full bg-zinc-800/80 border border-zinc-700/60 px-4 py-1.5 text-xs font-medium text-zinc-300 hover:bg-zinc-700/80 hover:text-white transition-all"
            >
              Freelance
            </a>
          </div>
        </div>

        {/* Personal projects */}
        <section id="personal" className="mb-16 scroll-mt-24">
          <h2 className="text-sm font-semibold text-zinc-300 mb-1">
            Personal &amp; Open Source
          </h2>
          <p className="text-xs text-zinc-600 mb-6">
            Side projects and open source contributions
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {projectsData.map((project, index) => (
              <ProjectCard key={index} project={project} />
            ))}
          </div>
        </section>

        {/* Freelance projects */}
        <section id="freelance" className="scroll-mt-24">
          <h2 className="text-sm font-semibold text-zinc-300 mb-1">
            Freelance &amp; Client Work
          </h2>
          <p className="text-xs text-zinc-600 mb-6">
            Projects built for clients and businesses
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {freelanceData.map((project, index) => (
              <ProjectCard key={index} project={project} badge="Client" />
            ))}
          </div>
        </section>

        {/* Bottom CTA */}
        <div className="mt-20 border-t border-zinc-800/60 pt-16 text-center">
          <p className="text-xs font-mono uppercase tracking-widest text-zinc-600 mb-4">
            What&apos;s next?
          </p>
          <h2 className="text-2xl font-bold text-zinc-100 mb-3">
            Have a project in mind?
          </h2>
          <p className="text-sm text-zinc-500 max-w-md mx-auto mb-8">
            I&apos;m always open to interesting freelance work, collaborations,
            or just a good conversation about tech.
          </p>
          <div className="flex items-center justify-center gap-3">
            <a
              href="mailto:jittojosephcareer@gmail.com"
              className="inline-flex items-center gap-2 rounded-full bg-zinc-100 px-5 py-2 text-sm font-medium text-zinc-900 hover:bg-white transition-colors"
            >
              Get in touch
            </a>
            <a
              href="https://www.linkedin.com/in/jittojoseph17/"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 rounded-full border border-zinc-700 px-5 py-2 text-sm font-medium text-zinc-400 hover:border-zinc-500 hover:text-zinc-200 transition-colors"
            >
              <LinkedInIcon className="h-4 w-4" />
              LinkedIn
            </a>
          </div>
        </div>
      </div>
    </main>
  );
}
