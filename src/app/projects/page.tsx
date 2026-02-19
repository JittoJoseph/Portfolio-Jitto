import Link from "next/link";
import Image from "next/image";
import projectsData from "@/data/projects.json";
import freelanceData from "@/data/freelance-projects.json";
import {
  ArrowLeftIcon,
  GitHubIcon,
  GlobeIcon,
  LinkIcon,
  LinkedInIcon,
} from "@/components/Icons";
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
      <div className="mx-auto max-w-3xl px-6 pt-24 pb-16">
        {/* Page heading */}
        <div className="mb-10 border-b border-zinc-800/60 pb-8">
          <div className="flex items-start justify-between mb-6">
            <div>
              <p className="text-[10px] font-mono uppercase tracking-widest text-zinc-600 mb-2">
                Portfolio
              </p>
              <h1 className="text-2xl font-bold tracking-tight text-white">
                Projects &amp; Contributions
              </h1>
            </div>
            <Link
              href="/"
              className="inline-flex items-center gap-1.5 text-xs font-medium text-zinc-500 hover:text-zinc-200 transition-colors mt-1"
            >
              <ArrowLeftIcon className="h-3.5 w-3.5" />
              Back to Home
            </Link>
          </div>
          {/* Section nav */}
          <div className="flex items-center gap-2">
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
          <div className="flex flex-col gap-4">
            {projectsData.map((project, index) => (
              <div
                key={index}
                className="group flex flex-col sm:flex-row gap-4 rounded-2xl border border-zinc-800/80 bg-zinc-900/50 p-3 hover:border-zinc-700 hover:bg-zinc-900/70 transition-all duration-200"
              >
                {/* Image */}
                {project.image && (
                  <div className="relative w-full h-44 sm:w-48 sm:h-36 sm:flex-shrink-0 rounded-xl overflow-hidden self-start">
                    <Image
                      src={project.image}
                      alt={project.title}
                      fill
                      className="object-cover opacity-80 group-hover:opacity-100 group-hover:scale-[1.03] transition-all duration-500"
                    />
                  </div>
                )}
                {/* Content */}
                <div className="flex-1 flex flex-col justify-between min-w-0 px-2 py-1.5">
                  <div>
                    <h3 className="text-[15px] font-semibold text-white leading-snug mb-1.5 tracking-tight">
                      {project.title}
                    </h3>
                    <p className="text-[13px] text-zinc-400 leading-relaxed mb-4">
                      {project.description}
                    </p>
                  </div>
                  <div className="flex flex-col gap-2.5">
                    <div className="flex flex-wrap gap-1.5">
                      {project.tech.map((t) => (
                        <span
                          key={t}
                          className="font-mono text-[9px] uppercase tracking-wider text-zinc-400 bg-zinc-800/60 border border-zinc-700/50 px-2 py-0.5 rounded-full"
                        >
                          {t}
                        </span>
                      ))}
                    </div>
                    <div className="flex items-center gap-3">
                      {project.links.map((link, i) => (
                        <a
                          key={i}
                          href={link.href}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-1.5 text-[11px] font-medium text-zinc-400 hover:text-white transition-colors"
                        >
                          {link.icon === "github" ? (
                            <GitHubIcon className="h-3.5 w-3.5" />
                          ) : link.icon === "globe" ? (
                            <GlobeIcon className="h-3.5 w-3.5" />
                          ) : link.icon === "linkedin" ? (
                            <LinkedInIcon className="h-3.5 w-3.5" />
                          ) : (
                            <LinkIcon className="h-3.5 w-3.5" />
                          )}
                          {link.label}
                        </a>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
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
          <div className="flex flex-col gap-4">
            {freelanceData.map((project, index) => (
              <div
                key={index}
                className="group flex flex-col sm:flex-row gap-4 rounded-2xl border border-zinc-800/80 bg-zinc-900/50 p-3 hover:border-zinc-700 hover:bg-zinc-900/70 transition-all duration-200"
              >
                {/* Image */}
                {project.image && (
                  <div className="relative w-full h-44 sm:w-48 sm:h-36 sm:flex-shrink-0 rounded-xl overflow-hidden self-start">
                    <Image
                      src={project.image}
                      alt={project.title}
                      fill
                      className="object-cover opacity-80 group-hover:opacity-100 group-hover:scale-[1.03] transition-all duration-500"
                    />
                  </div>
                )}
                {/* Content */}
                <div className="flex-1 flex flex-col justify-between min-w-0 px-2 py-1.5">
                  <div>
                    <div className="flex items-center gap-2 mb-1.5">
                      <h3 className="text-[15px] font-semibold text-white leading-snug tracking-tight">
                        {project.title}
                      </h3>
                      <span className="font-mono text-[8px] uppercase tracking-widest text-zinc-500 bg-zinc-800/60 border border-zinc-700/50 px-1.5 py-0.5 rounded-full flex-shrink-0">
                        Client
                      </span>
                    </div>
                    <p className="text-[13px] text-zinc-400 leading-relaxed mb-4">
                      {project.description}
                    </p>
                  </div>
                  <div className="flex flex-col gap-2.5">
                    <div className="flex flex-wrap gap-1.5">
                      {project.tech.map((t) => (
                        <span
                          key={t}
                          className="font-mono text-[9px] uppercase tracking-wider text-zinc-400 bg-zinc-800/60 border border-zinc-700/50 px-2 py-0.5 rounded-full"
                        >
                          {t}
                        </span>
                      ))}
                    </div>
                    <div className="flex items-center gap-3">
                      {project.links.map((link, i) => (
                        <a
                          key={i}
                          href={link.href}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-1.5 text-[11px] font-medium text-zinc-400 hover:text-white transition-colors"
                        >
                          {link.icon === "github" ? (
                            <GitHubIcon className="h-3.5 w-3.5" />
                          ) : link.icon === "globe" ? (
                            <GlobeIcon className="h-3.5 w-3.5" />
                          ) : link.icon === "linkedin" ? (
                            <LinkedInIcon className="h-3.5 w-3.5" />
                          ) : (
                            <LinkIcon className="h-3.5 w-3.5" />
                          )}
                          {link.label}
                        </a>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
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
              href="https://github.com/JittoJoseph"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 rounded-full border border-zinc-700 px-5 py-2 text-sm font-medium text-zinc-400 hover:border-zinc-500 hover:text-zinc-200 transition-colors"
            >
              <GitHubIcon className="h-4 w-4" />
              GitHub
            </a>
          </div>
        </div>
      </div>
    </main>
  );
}
