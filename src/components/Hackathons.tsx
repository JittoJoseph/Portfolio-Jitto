import Image from "next/image";

const HACKATHONS = [
  {
    title: "DevByZero Hackathon",
    badge: "1st Place",
    meta: "DMCON 2025",
    description:
      "Won 1st place at a national-level multi-round hackathon with a production-ready, high-impact DevOps platform.",
    image: "https://picsum.photos/seed/devbyzero/900/560",
  },
  {
    title: "NASA Space Apps Challenge",
    badge: "Global Nominee",
    meta: "2025",
    description:
      "Earned Global Nominee recognition at the world’s largest hackathon, rising from 11,500+ submissions across 150+ countries.",
    image: "https://picsum.photos/seed/spaceapps/900/560",
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
        {HACKATHONS.map((hackathon) => (
          <article
            key={hackathon.title}
            className="rounded-2xl border border-zinc-800/70 bg-zinc-900/30 p-6"
          >
            <div className="grid gap-5 sm:grid-cols-[220px_1fr] sm:items-center">
              <div className="relative h-40 w-full overflow-hidden rounded-2xl border border-zinc-800/60 bg-zinc-900 sm:h-32">
                <Image
                  src={hackathon.image}
                  alt={hackathon.title}
                  width={900}
                  height={560}
                  className="h-full w-full object-cover"
                />
              </div>
              <div className="space-y-2">
                <div className="flex flex-wrap items-center gap-2 text-xs uppercase tracking-[0.2em] text-zinc-500">
                  <span>{hackathon.badge}</span>
                  <span className="text-zinc-700">•</span>
                  <span>{hackathon.meta}</span>
                </div>
                <h3 className="text-lg font-semibold text-zinc-100">
                  {hackathon.title}
                </h3>
                <p className="text-sm leading-relaxed text-zinc-400">
                  {hackathon.description}
                </p>
              </div>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}
