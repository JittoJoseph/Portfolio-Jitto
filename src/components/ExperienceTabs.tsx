"use client";

import { useState } from "react";
import Image from "next/image";
import { GlobeIcon, LinkIcon } from "./Icons";

type Link = {
  label: string;
  href: string;
  icon?: string;
};

type ExperienceItem = {
  company?: string;
  institution?: string;
  role?: string;
  degree?: string;
  period: string;
  image?: string;
  bullets: string[];
  links: Link[];
};

export default function ExperienceTabs({
  career,
  education,
}: {
  career: ExperienceItem[];
  education: ExperienceItem[];
}) {
  const [activeTab, setActiveTab] = useState<"work" | "education">("work");

  const data = activeTab === "work" ? career : education;

  return (
    <div className="w-full">
      <div className="mb-8 flex w-full rounded-lg bg-zinc-900/50 p-1 border border-zinc-800/50">
        <button
          onClick={() => setActiveTab("work")}
          className={`flex-1 rounded-md py-2 text-sm font-medium transition-all ${
            activeTab === "work"
              ? "bg-zinc-800 text-zinc-100 shadow-sm"
              : "text-zinc-400 hover:text-zinc-200"
          }`}
        >
          Work
        </button>
        <button
          onClick={() => setActiveTab("education")}
          className={`flex-1 rounded-md py-2 text-sm font-medium transition-all ${
            activeTab === "education"
              ? "bg-zinc-800 text-zinc-100 shadow-sm"
              : "text-zinc-400 hover:text-zinc-200"
          }`}
        >
          Education
        </button>
      </div>

      <div className="space-y-12 animate-in fade-in slide-in-from-bottom-4 duration-500">
        {data.map((item, index) => (
          <div key={index} className="relative pl-16 pb-2">
            {/* Vertical timeline line */}
            <div className="absolute left-[20px] top-0 bottom-0 w-0.5 bg-zinc-800" />

            {/* Timeline logo or dot */}
            {item.image ? (
              <div className="absolute left-[0px] top-0 h-10 w-10 rounded-lg overflow-hidden border-2 border-zinc-900 bg-zinc-800">
                <Image
                  src={item.image}
                  alt={item.company || item.institution || "Logo"}
                  fill
                  className="object-cover"
                />
              </div>
            ) : (
              <div className="absolute -left-[9px] top-0 h-4 w-4 rounded-full border-2 border-zinc-900 bg-zinc-700" />
            )}

            <div className="flex flex-col gap-1 sm:flex-row sm:justify-between sm:items-baseline mb-2">
              <h3 className="text-lg font-semibold text-zinc-100">
                {item.company || item.institution}
              </h3>
              <span className="text-sm font-mono text-zinc-500">
                {item.period}
              </span>
            </div>

            <p className="text-base font-medium text-zinc-300 mb-4">
              {item.role || item.degree}
            </p>

            {item.bullets.length > 0 && (
              <ul className="mb-4 space-y-2 text-sm text-zinc-400 list-disc list-outside ml-4">
                {item.bullets.map((bullet, i) => (
                  <li key={i} className="leading-relaxed pl-1">
                    {bullet}
                  </li>
                ))}
              </ul>
            )}

            {item.links && item.links.length > 0 && (
              <div className="flex flex-wrap gap-2 mt-3">
                {item.links.map((link, i) => (
                  <a
                    key={i}
                    href={link.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1.5 rounded-full bg-zinc-100 px-3 py-1 text-xs font-medium text-zinc-900 transition-colors hover:bg-zinc-200"
                  >
                    {link.icon === "globe" ? (
                      <GlobeIcon className="h-3 w-3" />
                    ) : (
                      <LinkIcon className="h-3 w-3" />
                    )}
                    {link.label}
                  </a>
                ))}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
