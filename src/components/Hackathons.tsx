import Image from "next/image";
import Link from "next/link";
import { ArrowRightIcon } from "@/components/Icons";
import type { RecognitionData } from "@/lib/sanity/types";

type HackathonsProps = {
  recognitions: RecognitionData[];
};

export default function Hackathons({ recognitions }: HackathonsProps) {
  return (
    <section id="hackathons" className="mb-20 scroll-mt-24">
      <div className="mb-6 space-y-2">
        <h2 className="text-2xl font-semibold text-zinc-100">Highlights</h2>
        <p className="text-base leading-relaxed text-zinc-300">
          Some of my small wins.
        </p>
      </div>
      <div className="flex flex-col gap-4">
        {recognitions.map((hackathon) => (
          <article
            key={hackathon._id}
            className={`relative flex items-start gap-4 sm:gap-6 rounded-2xl border border-zinc-800/60 bg-zinc-950 p-4 transition-colors hover:bg-zinc-900/40 hover:border-zinc-700/60 ${
              hackathon.link ? " group cursor-pointer" : ""
            }`}
          >
            {hackathon.link && (
              <Link
                href={hackathon.link}
                target="_blank"
                rel="noopener noreferrer"
                className="absolute inset-0 z-10 rounded-2xl focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-zinc-500/60"
                aria-label={`Open ${hackathon.event}`}
              >
                <span className="sr-only">Open {hackathon.event}</span>
              </Link>
            )}
            
            <div className="relative h-20 w-28 shrink-0 overflow-hidden rounded-lg bg-zinc-900 sm:h-24 sm:w-36">
              <Image
                src={hackathon.image}
                alt={hackathon.event}
                fill
                sizes="(min-width: 640px) 9rem, 7rem"
                className="object-cover transition-transform duration-500 group-hover:scale-105"
              />
            </div>
            
            <div className="flex min-w-0 flex-1 flex-col py-0.5 sm:py-1">
              <div className="mb-2 flex items-center gap-2 flex-wrap">
                <span className="inline-flex items-center rounded-md border border-zinc-700/60 bg-zinc-800/40 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-[0.2em] text-zinc-300">
                  {hackathon.award}
                </span>
                <span className="text-[11px] uppercase tracking-[0.15em] text-zinc-500">
                  {hackathon.context}
                </span>
              </div>
              
              <h3 className="mb-1.5 inline-flex items-center gap-1.5 text-sm font-semibold text-zinc-100 leading-snug">
                {hackathon.event}
                {hackathon.link && (
                  <ArrowRightIcon className="h-3.5 w-3.5 -translate-x-1 text-zinc-500 opacity-0 transition-all group-hover:translate-x-0 group-hover:opacity-100 group-hover:text-zinc-300" />
                )}
              </h3>
              
              <p className="text-xs leading-relaxed text-zinc-400 line-clamp-2 sm:text-sm sm:line-clamp-none">
                {hackathon.summary}
              </p>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}
