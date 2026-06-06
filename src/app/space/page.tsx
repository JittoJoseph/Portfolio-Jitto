import Link from "next/link";
import FloatingImposter from "@/components/FloatingImposter";
import StarField from "@/components/StarField";
import { ArrowRightIcon } from "@/components/Icons";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Deep Space",
  description: "You've drifted far beyond the portfolio.",
};

export default function SpacePage() {
  return (
    <main className="relative min-h-screen bg-zinc-950 text-zinc-200 selection:bg-zinc-800 selection:text-zinc-100 font-sans flex flex-col items-center justify-center p-4 sm:p-6 overflow-hidden">
      <StarField />

      <FloatingImposter />

      <div className="relative z-10 mx-auto max-w-2xl flex flex-col items-center justify-center gap-4 text-center w-full">
        <div className="space-y-2">
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold tracking-tight text-zinc-100">
            Lost in Space
          </h2>
          <p className="text-base sm:text-lg text-zinc-400 max-w-md mx-auto px-4">
            You&apos;ve drifted far beyond the portfolio. Nothing but stars out here...
          </p>
        </div>

        <div className="pt-4 z-20">
          <Link
            href="/"
            className="group inline-flex items-center justify-center gap-2 rounded-md bg-zinc-100 px-6 py-3 text-sm sm:text-base font-medium text-zinc-900 transition-colors hover:bg-zinc-200 focus:outline-none focus:ring-2 focus:ring-zinc-400 focus:ring-offset-2 focus:ring-offset-zinc-950 shadow-sm"
          >
            Return Home
            <ArrowRightIcon className="h-4 w-4 transition-transform group-hover:translate-x-1" />
          </Link>
        </div>
      </div>
    </main>
  );
}
