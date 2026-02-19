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

export default function ProjectCard({ project }: { project: Project }) {
  return (
    <div className="flex flex-col rounded-xl border border-zinc-800 bg-zinc-900/50 overflow-hidden transition-all hover:bg-zinc-900 hover:border-zinc-700 hover:shadow-lg hover:shadow-zinc-900/20 group">
      {project.image && (
        <div className="relative h-32 w-full overflow-hidden">
          <Image
            src={project.image}
            alt={project.title}
            fill
            className="object-cover transition-transform duration-500 group-hover:scale-105"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/65 to-transparent" />
          {/* Tech stack overlay */}
          <div className="absolute bottom-2 left-3 right-3 flex flex-wrap gap-1">
            {project.tech.slice(0, 3).map((t) => (
              <span
                key={t}
                className="font-mono text-[8px] uppercase tracking-wider text-zinc-300 bg-black/50 px-1.5 py-0.5 rounded"
              >
                {t}
              </span>
            ))}
          </div>
        </div>
      )}
      <div className="p-4 flex flex-col flex-1">
        <h3 className="text-sm font-semibold text-zinc-100 leading-snug">
          {project.title}
        </h3>
        <p className="mt-1.5 text-xs text-zinc-500 leading-relaxed flex-1">
          {project.description}
        </p>
        <div className="mt-3 flex flex-wrap gap-1.5 pt-3 border-t border-zinc-800/60">
          {project.links.map((link, i) => (
            <a
              key={i}
              href={link.href}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1 rounded border border-zinc-700 px-2 py-0.5 text-[10px] font-medium text-zinc-400 transition-colors hover:border-zinc-500 hover:text-zinc-200"
            >
              {link.icon === "github" ? (
                <GitHubIcon className="h-3 w-3" />
              ) : link.icon === "globe" ? (
                <GlobeIcon className="h-3 w-3" />
              ) : link.icon === "linkedin" ? (
                <LinkedInIcon className="h-3 w-3" />
              ) : (
                <LinkIcon className="h-3 w-3" />
              )}
              {link.label}
            </a>
          ))}
        </div>
      </div>
    </div>
  );
}
