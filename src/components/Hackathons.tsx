import Image from "next/image";
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
      <div className="space-y-3">
        {recognitions.map((hackathon) => (
          <article
            key={hackathon._id}
            className="rounded-xl border border-zinc-800/50 bg-zinc-900/20 p-4 transition-colors hover:border-zinc-700/70 hover:bg-zinc-900/30"
          >
            <div className="flex items-start gap-4">
              <div className="relative h-20 w-24 shrink-0 overflow-hidden rounded-lg border border-zinc-800/50 bg-zinc-900">
                <Image
                  src={hackathon.image}
                  alt={hackathon.event}
                  width={96}
                  height={80}
                  className="h-full w-full object-cover"
                />
              </div>
              <div className="min-w-0 flex-1 space-y-1.5">
                <div className="flex items-center gap-2">
                  <span className="inline-flex items-center rounded-md border border-zinc-700/60 bg-zinc-900/60 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-[0.2em] text-zinc-100">
                    {hackathon.award}
                  </span>
                  <span className="text-[11px] uppercase tracking-[0.15em] text-zinc-500">
                    {hackathon.context}
                  </span>
                </div>
                <h3 className="text-sm font-semibold text-zinc-100 leading-snug">
                  {hackathon.event}
                </h3>
                <p className="text-xs leading-relaxed text-zinc-400 line-clamp-2">
                  {hackathon.summary}
                </p>
              </div>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}
