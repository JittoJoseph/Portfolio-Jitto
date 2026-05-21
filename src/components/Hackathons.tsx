import Image from "next/image";

const HACKATHON_WINS = [
  {
    event: "DevByZero Hackathon",
    award: "1st Place",
    year: "DMCON 2025",
    summary:
      "Won 1st place at a national-level multi-round hackathon with a production-ready, high-impact DevOps platform.",
    image: "https://picsum.photos/seed/devbyzero/900/560",
  },
  {
    event: "NASA Space Apps Challenge",
    award: "Global Nominee",
    year: "2025",
    summary:
      "Earned Global Nominee recognition at the world’s largest hackathon, rising from 11,500+ submissions across 150+ countries.",
    image: "https://picsum.photos/seed/spaceapps/900/560",
  },
  {
    event: "Feather Grant",
    award: "Awardee",
    year: "gradCapital 2024",
    summary:
      "Selected as one of only six funded ideas from 5,000+ nationwide submissions.",
    image: "https://picsum.photos/seed/feathergrant/900/560",
  },
];

export default function Hackathons() {
  return (
    <section id="hackathons" className="mb-20 scroll-mt-24">
      <div className="mb-6 space-y-2">
        <h2 className="text-2xl font-semibold text-zinc-100">
          Hackathon Highlights
        </h2>
        <p className="text-sm text-zinc-400">Some of my small wins.</p>
      </div>
      <div className="space-y-6">
        {HACKATHON_WINS.map((hackathon) => (
          <article
            key={hackathon.event}
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
                    {hackathon.year}
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
