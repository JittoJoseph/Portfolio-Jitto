import Image from "next/image";

const HACKATHONS = [
  {
    title: "DevByZero Hackathon",
    badge: "1st Place",
    meta: "DMCON 2025",
    description: "FlowLens - AI DevOps visibility from commit to prod.",
    image: "/hackathons/devbyzero.svg",
  },
  {
    title: "NASA Space Apps Challenge",
    badge: "Global Nominee",
    meta: "2025",
    description: "Endurance Protocol - NASA-reviewed impact concept.",
    image: "/hackathons/space-apps.svg",
  },
];

export default function Hackathons() {
  return (
    <section id="hackathons" className="mb-20 scroll-mt-24">
      <div className="mb-6 space-y-1">
        <p className="text-xs uppercase tracking-[0.3em] text-zinc-500">
          Hackathon Ledger
        </p>
        <h2 className="text-xl font-semibold text-zinc-100">
          Hackathon Ledger
        </h2>
        <p className="text-sm text-zinc-400">Some of my small wins.</p>
      </div>
      <div className="space-y-4">
        {HACKATHONS.map((hackathon) => (
          <article
            key={hackathon.title}
            className="flex flex-col gap-4 rounded-2xl border border-zinc-800/70 bg-zinc-900/30 p-4 sm:flex-row sm:items-center"
          >
            <div className="relative h-20 w-28 shrink-0 overflow-hidden rounded-xl border border-zinc-800/60 bg-zinc-900">
              <Image
                src={hackathon.image}
                alt={hackathon.title}
                width={112}
                height={80}
                className="h-full w-full object-cover"
              />
            </div>
            <div className="space-y-1">
              <div className="flex flex-wrap items-center gap-2 text-xs uppercase tracking-[0.2em] text-zinc-500">
                <span>{hackathon.badge}</span>
                <span className="text-zinc-700">•</span>
                <span>{hackathon.meta}</span>
              </div>
              <h3 className="text-base font-semibold text-zinc-100">
                {hackathon.title}
              </h3>
              <p className="text-sm text-zinc-400">{hackathon.description}</p>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}
