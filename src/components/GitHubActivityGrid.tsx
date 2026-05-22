"use client";

import type { CSSProperties } from "react";
import { useEffect, useMemo, useRef, useState } from "react";
import { createPortal } from "react-dom";

import type { GitHubContributionActivity } from "@/lib/github/activity";

const levelClasses = [
  "bg-[#161b22]",
  "bg-[#0e4429]",
  "bg-[#006d32]",
  "bg-[#26a641]",
  "bg-[#39d353]",
] as const;

type TooltipState = {
  text: string;
  x: number;
  y: number;
};

export default function GitHubActivityGrid({
  activity,
}: {
  activity: GitHubContributionActivity;
}) {
  const [tooltip, setTooltip] = useState<TooltipState | null>(null);
  const rafIdRef = useRef<number | null>(null);
  const portalRoot = typeof document === "undefined" ? null : document.body;

  useEffect(() => {
    return () => {
      if (rafIdRef.current !== null) {
        cancelAnimationFrame(rafIdRef.current);
      }
    };
  }, []);

  const graphColumns = useMemo(
    () => `repeat(${activity.weeks.length}, var(--activity-cell))`,
    [activity.weeks.length],
  );

  const activityStyle = {
    "--activity-cell": "9px",
    "--activity-gap": "2px",
  } as CSSProperties;

  const graphStyle = {
    gridTemplateColumns: graphColumns,
  } as CSSProperties;

  const scheduleTooltip = (text: string, x: number, y: number) => {
    if (rafIdRef.current !== null) {
      return;
    }

    rafIdRef.current = requestAnimationFrame(() => {
      rafIdRef.current = null;
      setTooltip((prev) => {
        if (prev && prev.text === text && prev.x === x && prev.y === y) {
          return prev;
        }
        return { text, x, y };
      });
    });
  };

  const hideTooltip = () => {
    if (rafIdRef.current !== null) {
      cancelAnimationFrame(rafIdRef.current);
      rafIdRef.current = null;
    }
    setTooltip(null);
  };

  return (
    <>
      <div className="min-w-max px-2" style={activityStyle}>
        <div
          className="mb-2 grid text-[10px] leading-none text-zinc-500 sm:text-[11px]"
          style={{
            ...graphStyle,
            columnGap: "var(--activity-gap)",
          }}
        >
          {activity.monthLabels.map((month) => (
            <span
              key={`${month.label}-${month.weekIndex}`}
              style={{ gridColumnStart: month.weekIndex + 1 }}
            >
              {month.label}
            </span>
          ))}
        </div>

        <div
          className="grid"
          style={{
            ...graphStyle,
            columnGap: "var(--activity-gap)",
          }}
        >
          {activity.weeks.map((week, weekIndex) => (
            <div
              key={`week-${weekIndex}`}
              className="grid"
              style={{
                gridTemplateRows: "repeat(7, var(--activity-cell))",
                rowGap: "var(--activity-gap)",
              }}
            >
              {week.map((day, dayIndex) => {
                const key = day ? day.date : `empty-${weekIndex}-${dayIndex}`;
                const tooltipText = day
                  ? `${day.count} contribution${day.count !== 1 ? "s" : ""}`
                  : "";

                return (
                  <span
                    key={key}
                    className="block"
                    onMouseEnter={(event) => {
                      if (day) {
                        scheduleTooltip(
                          tooltipText,
                          event.clientX,
                          event.clientY - 18,
                        );
                      }
                    }}
                    onMouseMove={(event) => {
                      if (day) {
                        scheduleTooltip(
                          tooltipText,
                          event.clientX,
                          event.clientY - 18,
                        );
                      }
                    }}
                    onMouseLeave={hideTooltip}
                  >
                    <span
                      className={`block rounded-[2px] ${day ? levelClasses[day.level] : levelClasses[0]}`}
                      style={{
                        width: "var(--activity-cell)",
                        height: "var(--activity-cell)",
                      }}
                    />
                  </span>
                );
              })}
            </div>
          ))}
        </div>
      </div>

      {portalRoot &&
        tooltip &&
        createPortal(
          <div
            role="tooltip"
            className="pointer-events-none fixed z-50 -translate-x-1/2 -translate-y-2 whitespace-nowrap rounded-md bg-zinc-900/90 px-2 py-1 text-[10px] text-zinc-100 shadow-sm ring-1 ring-white/10 backdrop-blur-sm"
            style={{ left: tooltip.x, top: tooltip.y }}
          >
            {tooltip.text}
          </div>,
          portalRoot,
        )}
    </>
  );
}
