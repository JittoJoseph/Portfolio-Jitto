"use client";

import { useState } from "react";
import Image from "next/image";
import { GlobeIcon, LinkIcon, LinkedInIcon } from "./Icons";

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
    <div className="w-full rounded-2xl border border-zinc-800 bg-zinc-950">
      <div className="flex border-b border-zinc-800/80 p-1.5 gap-1.5">
        {(["work", "education"] as const).map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`flex-1 rounded-xl py-2.5 text-sm font-medium transition-all ${
              activeTab === tab
                ? "bg-zinc-800/60 text-zinc-300"
                : "text-zinc-600 hover:text-zinc-400"
            }`}
          >
            {tab === "work" ? "Work" : "Education"}
          </button>
        ))}
      </div>

      <div className="divide-y divide-zinc-800/60 animate-in fade-in slide-in-from-bottom-4 duration-500">
        {data.map((item, index) => (
          <div key={index} className="px-5 py-5">
            <div className="flex items-start gap-4 mb-4">
              {item.image && (
                <div className="relative h-12 w-12 flex-shrink-0 rounded-xl overflow-hidden bg-zinc-900">
                  <Image
                    src={item.image}
                    alt={item.company || item.institution || ""}
                    fill
                    className="object-cover"
                  />
                </div>
              )}
              <div className="flex-1 min-w-0">
                <div className="flex flex-wrap items-baseline justify-between gap-x-3 gap-y-1">
                  <h3 className="text-[15px] font-semibold text-zinc-100 leading-snug">
                    {item.company || item.institution}
                  </h3>
                  <span className="font-mono text-[11px] text-zinc-500 flex-shrink-0">
                    {item.period}
                  </span>
                </div>
                <p className="text-sm text-zinc-400 mt-1">
                  {item.role || item.degree}
                </p>
              </div>
            </div>

            {item.bullets.length > 0 && (
              <ul className="space-y-2.5 border-t border-zinc-800/60 pt-4 mb-4">
                {item.bullets.map((bullet, i) => (
                  <li
                    key={i}
                    className="flex gap-2.5 text-sm text-zinc-400 leading-relaxed"
                  >
                    <span className="mt-2 h-1.5 w-1.5 flex-shrink-0 rounded-full bg-zinc-700" />
                    {bullet}
                  </li>
                ))}
              </ul>
            )}

            {item.links?.length > 0 && (
              <div className="flex flex-wrap gap-2">
                {item.links.map((link, i) => (
                  <a
                    key={i}
                    href={link.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1.5 rounded-full border border-zinc-700/60 bg-zinc-800/50 px-3 py-1 text-xs font-medium text-zinc-300 transition-colors hover:border-zinc-600 hover:text-zinc-100"
                  >
                    {link.icon === "globe" ? (
                      <GlobeIcon className="h-3 w-3" />
                    ) : link.icon === "linkedin" ? (
                      <LinkedInIcon className="h-3 w-3" />
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
