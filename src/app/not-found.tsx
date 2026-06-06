import Link from "next/link";
import RetroTvError from "@/components/RetroTvError";
import { ArrowRightIcon } from "@/components/Icons";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "404 - Page Not Found",
  description: "The page you are looking for does not exist.",
};

export default function NotFound() {
  return (
    <main className="min-h-screen bg-zinc-950 text-zinc-200 selection:bg-zinc-800 selection:text-zinc-100 font-sans flex flex-col items-center justify-center p-4 sm:p-6 overflow-hidden">
      <div className="mx-auto max-w-2xl flex flex-col items-center justify-center gap-2 sm:gap-4 relative z-10 text-center w-full">
        
        {/* Top: Retro TV */}
        <div className="relative flex items-center justify-center pointer-events-none sm:pointer-events-auto">
           <RetroTvError className="transform-gpu scale-95 sm:scale-90 lg:scale-[0.85] xl:scale-75" />
        </div>

        <div className="space-y-2 mt-4 sm:mt-6">
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold tracking-tight text-zinc-100">
            Lost in Space
          </h2>
          <p className="text-base sm:text-lg text-zinc-400 max-w-md mx-auto px-4">
            Sorry, we couldn&apos;t find the page you&apos;re looking for. The coordinates might be missing.
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
