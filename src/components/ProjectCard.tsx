import Image from "next/image";
import Link from "next/link";
import {
  GitHubIcon,
  GlobeIcon,
  LinkIcon,
  LinkedInIcon,
} from "@/components/Icons";
import type { ProjectData } from "@/lib/sanity/types";

export default function ProjectCard({
  project,
  badge,
  priority = false,
}: {
  project: ProjectData;
  badge?: string;
  priority?: boolean;
}) {
  const firstLink = project.links?.[0];

  return (
    <div className="group relative rounded-2xl border border-zinc-800/80 bg-zinc-900/50 p-3 hover:border-zinc-700 hover:bg-zinc-900/70 transition-colors duration-200">
      {firstLink && (
        <Link
          href={firstLink.href}
          target="_blank"
          rel="noopener noreferrer"
          className="absolute inset-0 z-10 rounded-2xl"
          aria-label={`View ${project.title}`}
        />
      )}
      
      {project.image && (
        <div className="relative mb-3 h-44 w-full overflow-hidden rounded-xl">
          <Image
            src={project.image}
            alt={project.title}
            fill
            sizes="(min-width: 640px) 50vw, 100vw"
            priority={priority}
            className="object-cover opacity-80 transition-all duration-500 group-hover:scale-[1.02] group-hover:opacity-100"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent pointer-events-none" />
          {badge && (
            <span className="absolute right-2 top-2 rounded-full border border-zinc-700/60 bg-zinc-900/80 px-1.5 py-0.5 font-mono text-[8px] uppercase tracking-widest text-zinc-400">
              {badge}
            </span>
          )}
        </div>
      )}
      <div className="px-1">
        <h3 className="mb-1.5 text-[15px] font-semibold leading-snug tracking-tight text-white">
          {project.title}
        </h3>
        <p className="mb-3 text-[13px] leading-relaxed text-zinc-400">
          {project.description}
        </p>
        <div className="mb-3 flex flex-wrap gap-1.5">
          {project.tech.map((t) => (
            <span
              key={t}
              className="rounded-full border border-zinc-700/50 bg-zinc-800/60 px-2 py-0.5 font-mono text-[9px] uppercase tracking-wider text-zinc-400"
            >
              {t}
            </span>
          ))}
        </div>
        <div className="relative z-20 flex items-center gap-3 border-t border-zinc-800/60 pt-2">
          {project.links.map((link, i) => (
            <Link
              key={i}
              href={link.href}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 text-[11px] font-medium text-zinc-400 transition-colors hover:text-white"
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
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
