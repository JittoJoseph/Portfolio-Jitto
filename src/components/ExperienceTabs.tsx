"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { ArrowRightIcon, GlobeIcon, LinkIcon, LinkedInIcon } from "./Icons";
import type { ExperienceData } from "@/lib/sanity/types";

export default function ExperienceTabs({
  career,
  education,
  showExperienceDetails,
}: {
  career: ExperienceData[];
  education: ExperienceData[];
  showExperienceDetails: boolean;
}) {
  const [activeTab, setActiveTab] = useState<"work" | "education">("work");

  const data = activeTab === "work" ? career : education;
  const showDetails = activeTab === "education" || showExperienceDetails;

  return (
    <div className="relative z-30 w-full rounded-2xl border border-zinc-800 bg-zinc-950">
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
        {data.map((item, index) => {
          const location = item.location?.trim();
          const primaryLink = item.links[0]?.href;
          const headerClassName = `flex items-start gap-4 ${
            showDetails ? "mb-4" : ""
          } ${!showDetails && primaryLink ? "group/header" : ""}`;
          const headerContent = (
            <>
              {item.image && (
                <div className="relative h-12 w-12 flex-shrink-0 overflow-hidden rounded-xl bg-zinc-900">
                  <Image
                    src={item.image}
                    alt={item.company || item.institution || ""}
                    fill
                    sizes="3rem"
                    className="object-cover"
                  />
                </div>
              )}
              <div className="flex-1 min-w-0">
                <div className="flex flex-col gap-2 sm:flex-row sm:items-start sm:justify-between sm:gap-x-4">
                  <div className="min-w-0">
                    <h3 className="inline-flex items-center gap-1.5 text-base font-semibold leading-5 text-zinc-100">
                      {item.company || item.institution}
                      {!showDetails && primaryLink && (
                        <ArrowRightIcon className="h-4 w-4 -translate-x-1 text-zinc-300 opacity-0 transition-all group-hover/header:translate-x-0 group-hover/header:opacity-100" />
                      )}
                    </h3>
                    <p className="mt-1 text-sm font-medium leading-5 text-zinc-300/90">
                      {item.role || item.degree}
                    </p>
                  </div>
                  <div className="shrink-0 text-left sm:max-w-[14rem] sm:text-right">
                    <p className="text-[13px] font-medium leading-5 text-zinc-300">
                      {item.period}
                    </p>
                    {location && (
                      <p className="mt-0.5 text-[13px] font-normal leading-5 text-zinc-500 sm:ml-auto">
                        {location}
                      </p>
                    )}
                  </div>
                </div>
              </div>
            </>
          );

          return (
            <div key={index} className="px-5 py-5">
              {!showDetails && primaryLink ? (
                <Link
                  href={primaryLink}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={headerClassName}
                >
                  {headerContent}
                </Link>
              ) : (
                <div className={headerClassName}>{headerContent}</div>
              )}

              {showDetails && item.bullets.length > 0 && (
                <ul className="space-y-1.5 border-t border-zinc-800/60 pt-4 mb-4">
                  {item.bullets.map((bullet, i) => (
                    <li
                      key={i}
                      className="flex gap-2.5 text-sm text-zinc-400 leading-[1.45]"
                    >
                      <span className="mt-[0.5rem] h-1.5 w-1.5 flex-shrink-0 rounded-full bg-zinc-700" />
                      {bullet}
                    </li>
                  ))}
                </ul>
              )}

              {showDetails && item.links?.length > 0 && (
                <div className="flex flex-wrap gap-2">
                  {item.links.map((link, i) => (
                    <Link
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
                    </Link>
                  ))}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
