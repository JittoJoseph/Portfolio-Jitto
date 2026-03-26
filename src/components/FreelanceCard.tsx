import Image from "next/image";
import Link from "next/link";
import { ArrowRightIcon } from "@/components/Icons";
import type { ProjectData } from "@/lib/sanity/types";

export default function FreelanceCard({
  projects,
}: {
  projects: ProjectData[];
}) {
  return (
    <Link
      href="/projects#freelance"
      className="group sm:col-span-2 rounded-2xl border border-zinc-800 bg-zinc-950 p-4 hover:border-zinc-700 transition-all duration-200 block"
    >
      <div className="flex items-center justify-between mb-4 pb-3 border-b border-zinc-800/80">
        <div className="flex items-center gap-3">
          <span className="font-mono text-[10px] uppercase tracking-widest text-zinc-500">
            FREELANCE WORK
          </span>
        </div>
        <span className="font-mono text-[10px] text-zinc-600 group-hover:text-zinc-400 transition-colors flex items-center gap-1">
          view all <ArrowRightIcon className="h-3 w-3" />
        </span>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        {projects.slice(0, 2).map((project, i) => (
          <div
            key={i}
            className="rounded-xl border border-zinc-800/70 overflow-hidden bg-zinc-900/40"
          >
            <div className="relative w-full h-28 overflow-hidden">
              {project.image ? (
                <Image
                  src={project.image}
                  alt={project.title}
                  fill
                  className="object-cover opacity-80 group-hover:opacity-90 transition-opacity duration-300 group-hover:scale-[1.02] transition-transform"
                />
              ) : (
                <div className="h-full w-full bg-zinc-900" />
              )}
            </div>
            <div className="px-3 pt-2 pb-3">
              <p className="text-[12px] font-semibold text-zinc-100 leading-snug truncate">
                {project.title}
              </p>
              <p className="font-mono text-[9px] text-zinc-600 mt-0.5 truncate">
                {project.tech.join(" · ")}
              </p>
            </div>
          </div>
        ))}
      </div>

      {/* Footer */}
      <div className="mt-3 pt-3 border-t border-zinc-800/60 flex items-center justify-between">
        <span className="font-mono text-[9px] text-zinc-700">
          {projects.length > 2
            ? `+${projects.length - 2} more project${projects.length - 2 > 1 ? "s" : ""}`
            : `${projects.length} client projects`}
        </span>
        <span className="font-mono text-[9px] text-zinc-700">
          status: delivered
        </span>
      </div>
    </Link>
  );
}
