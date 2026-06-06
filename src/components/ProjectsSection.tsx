"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import dynamic from "next/dynamic";
import { ArrowRightIcon, RocketIcon } from "@/components/Icons";
import ProjectCard from "@/components/ProjectCard";
import type { ProjectData } from "@/lib/sanity/types";

// Dynamically import the 3D scene with ssr: false to prevent hydration errors and improve FCP
const Projects3DScene = dynamic(() => import("./Projects3DScene"), {
  ssr: false,
  loading: () => (
    <div className="absolute inset-0 flex items-center justify-center">
      <div className="flex flex-col items-center gap-3">
        <div className="h-5 w-5 animate-spin rounded-full border-2 border-zinc-700 border-t-zinc-400" />
        <span className="text-[10px] font-medium tracking-widest uppercase text-zinc-500">
          Loading 3D
        </span>
      </div>
    </div>
  ),
});

function useIsVisible<T extends HTMLElement>(rootMargin = "160px") {
  const ref = useRef<T>(null);
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    const element = ref.current;
    if (!element || !("IntersectionObserver" in window)) return;

    const observer = new IntersectionObserver(
      ([entry]) => setIsVisible(entry.isIntersecting),
      { rootMargin },
    );
    observer.observe(element);
    return () => observer.disconnect();
  }, [rootMargin]);

  return { ref, isVisible };
}

export default function ProjectsSection({
  projects,
}: {
  projects: ProjectData[];
}) {
  const { ref, isVisible } = useIsVisible<HTMLElement>();

  const featuredProjects = projects
    .filter((project) => project.featured)
    .slice(0, 3);

  return (
    <section
      id="projects"
      ref={ref}
      className="mb-16 mt-8 scroll-mt-24 md:mt-6"
    >
      <div className="relative overflow-visible">
        <div className="flex flex-col-reverse gap-4 md:grid md:grid-cols-[1fr_1.15fr] md:gap-0 md:items-center">
          <div className="flex flex-col items-center gap-4 text-center md:items-start md:text-left">
            <h2 className="text-2xl font-semibold text-zinc-100">Projects</h2>
            <p className="max-w-[260px] text-sm leading-relaxed text-zinc-400 md:max-w-[220px]">
              A collection of things I&apos;ve built and shipped.
            </p>
            <div className="flex flex-col items-center gap-4 md:items-start mt-2">
              <Link
                href="/projects"
                className="group inline-flex w-fit items-center gap-2 rounded-full border border-zinc-700/70 bg-zinc-900/50 px-5 py-2.5 text-sm font-medium text-zinc-200 transition-colors hover:border-zinc-600 hover:bg-zinc-900 hover:text-zinc-100"
              >
                Explore all projects
                <ArrowRightIcon className="h-4 w-4 text-zinc-500 transition-transform group-hover:translate-x-1 group-hover:text-zinc-300" />
              </Link>
              <Link
                href="/space"
                className="group inline-flex w-fit items-center gap-2 rounded-full border border-zinc-800/80 bg-zinc-950/50 ms-2 px-3 py-1.5 backdrop-blur-md transition-all hover:border-zinc-700 hover:bg-zinc-900/80"
                aria-label="Launch into Space easter egg"
              >
                <RocketIcon className="h-3.5 w-3.5 text-zinc-500 transition-colors group-hover:text-zinc-300" />
                <span className="text-xs font-medium tracking-wide text-zinc-500 transition-colors group-hover:text-zinc-300">
                  Launch into space
                </span>
              </Link>
            </div>
          </div>
          <div className="relative overflow-visible">
            {/* Canvas */}
            <div className="relative h-[280px] sm:h-[320px] md:h-[240px] lg:h-[280px]">
              <Projects3DScene isVisible={isVisible} />
            </div>

            <div
              aria-hidden
              className="pointer-events-none absolute bottom-0 left-1/2 h-14 w-4/5 -translate-x-1/2"
              style={{
                background:
                  "radial-gradient(ellipse at 50% 10%, rgba(180,180,195,0.08) 0%, #09090b 70%)",
                filter: "blur(8px)",
              }}
            />
          </div>
        </div>
      </div>

      <div className="mt-12 md:mt-2">
        <div className="mb-3 flex items-center justify-between">
          <p className="text-xs font-semibold uppercase tracking-[0.22em] text-zinc-500">
            Featured projects
          </p>
        </div>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          {featuredProjects.map((project, index) => (
            <ProjectCard key={index} project={project} priority={index === 0} />
          ))}
        </div>
      </div>
    </section>
  );
}
