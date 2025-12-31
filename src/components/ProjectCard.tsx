import Image from "next/image";
import { GitHubIcon, GlobeIcon, LinkIcon } from "@/components/Icons";

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
    <div className="flex flex-col rounded-xl border border-zinc-800 bg-zinc-900/50 overflow-hidden transition-all hover:bg-zinc-900 hover:border-zinc-700 hover:shadow-lg hover:shadow-zinc-900/20">
      {project.image && (
        <div className="relative h-48 w-full border-b border-zinc-800/50">
          <Image
            src={project.image}
            alt={project.title}
            fill
            className="object-cover"
          />
        </div>
      )}
      <div className="p-5 flex flex-col flex-1">
        <h3 className="text-lg font-bold text-zinc-100">{project.title}</h3>
        <p className="mt-2 text-sm text-zinc-400 leading-relaxed flex-1">
          {project.description}
        </p>

        <div className="mt-4 flex flex-wrap gap-2">
          {project.tech.map((t) => (
            <span
              key={t}
              className="rounded-md bg-zinc-800 px-2 py-1 text-[10px] font-medium text-zinc-300 border border-zinc-700/50 uppercase tracking-wider"
            >
              {t}
            </span>
          ))}
        </div>

        <div className="mt-4 flex flex-wrap gap-2 pt-2 border-t border-zinc-800/50">
          {project.links.map((link, i) => (
            <a
              key={i}
              href={link.href}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 rounded-md bg-zinc-100 px-2.5 py-1 text-xs font-medium text-zinc-900 transition-colors hover:bg-zinc-200"
            >
              {link.icon === "github" ? (
                <GitHubIcon className="h-3.5 w-3.5" />
              ) : link.icon === "globe" ? (
                <GlobeIcon className="h-3.5 w-3.5" />
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
