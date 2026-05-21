import Image from "next/image";
import type { RecognitionData } from "@/lib/sanity/types";

type HackathonsProps = {
  recognitions: RecognitionData[];
};

export default function Hackathons({ recognitions }: HackathonsProps) {
  return (
    <section id="hackathons" className="mb-20 scroll-mt-24">
      <div className="mb-6 space-y-2">
        <h2 className="text-2xl font-semibold text-zinc-100">Notable Wins</h2>
        <p className="text-base leading-relaxed text-zinc-400">
          Some of my small wins.
        </p>
      </div>
      <div className="space-y-6">
        {recognitions.map((hackathon) => (
          <article
            key={hackathon._id}
            className="rounded-2xl border border-zinc-800/70 bg-zinc-900/30 p-6"
          >
            <div className="grid gap-5 sm:grid-cols-[220px_1fr] sm:items-center">
              <div className="relative h-40 w-full overflow-hidden rounded-2xl border border-zinc-800/60 bg-zinc-900 sm:h-32">
                <Image
                  src={hackathon.image}
                  alt={hackathon.event}
                  width={900}
                  height={560}
                  className="h-full w-full object-cover"
                />
              </div>
              <div className="space-y-2">
                <div className="flex flex-wrap items-center gap-3">
                  <span className="inline-flex items-center rounded-full border border-zinc-700/70 bg-zinc-900/80 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.25em] text-zinc-100">
                    {hackathon.award}
                  </span>
                  <span className="text-xs uppercase tracking-[0.2em] text-zinc-500">
                    {hackathon.context}
                  </span>
                </div>
                <h3 className="text-lg font-semibold text-zinc-100">
                  {hackathon.event}
                </h3>
                <p className="text-sm leading-relaxed text-zinc-400">
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
