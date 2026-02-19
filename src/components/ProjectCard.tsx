import Image from "next/image";
import {
  GitHubIcon,
  GlobeIcon,
  LinkIcon,
  LinkedInIcon,
} from "@/components/Icons";

type Link = {
  label: string;
  href: string;
  icon?: string;
};

type Project = {
  title: string;
  description: string;
  tech: string[];
  links: Link[];
  featured?: boolean;
  image?: string;
};

export default function ProjectCard({
  project,
  badge,
}: {
  project: Project;
  badge?: string;
}) {
  return (
    <div className="group rounded-2xl border border-zinc-800/80 bg-zinc-900/50 p-3 hover:border-zinc-700 hover:bg-zinc-900/70 transition-all duration-200">
      {project.image && (
        <div className="relative w-full h-44 rounded-xl overflow-hidden mb-3">
          <Image
            src={project.image}
            alt={project.title}
            fill
            className="object-cover opacity-80 group-hover:opacity-100 group-hover:scale-[1.02] transition-all duration-500"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent" />
          {badge && (
            <span className="absolute top-2 right-2 font-mono text-[8px] uppercase tracking-widest text-zinc-400 bg-zinc-900/80 border border-zinc-700/60 px-1.5 py-0.5 rounded-full">
              {badge}
            </span>
          )}
        </div>
      )}
      <div className="px-1">
        <h3 className="text-[15px] font-semibold text-white leading-snug mb-1.5 tracking-tight">
          {project.title}
        </h3>
        <p className="text-[13px] text-zinc-400 leading-relaxed mb-3">
          {project.description}
        </p>
        <div className="flex flex-wrap gap-1.5 mb-3">
          {project.tech.map((t) => (
            <span
              key={t}
              className="font-mono text-[9px] uppercase tracking-wider text-zinc-400 bg-zinc-800/60 border border-zinc-700/50 px-2 py-0.5 rounded-full"
            >
              {t}
            </span>
          ))}
        </div>
        <div className="flex items-center gap-3 pt-2 border-t border-zinc-800/60">
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
  );
}
