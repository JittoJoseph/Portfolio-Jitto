"use client";

import Link from "next/link";
import { CodeIcon, HomeIcon, TrophyIcon } from "lucide-react";

import { Dock, DockIcon } from "@/components/magicui/dock";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";

const NAV_ITEMS = [
  { id: "home", href: "/#home", label: "Home", icon: HomeIcon },
  { id: "projects", href: "/#projects", label: "Projects", icon: CodeIcon },
  {
    id: "hackathons",
    href: "/#hackathons",
    label: "Hackathons",
    icon: TrophyIcon,
  },
];

export default function FloatingDock() {
  return (
    <div className="pointer-events-none fixed inset-x-0 bottom-0 z-30 mx-auto mb-4 flex origin-bottom h-full max-h-10">
      <div className="fixed bottom-0 inset-x-0 h-16 w-full bg-gradient-to-t from-background/40 via-background/10 to-transparent backdrop-blur-md [-webkit-mask-image:linear-gradient(to_top,black,transparent)] dark:from-background/30 dark:via-background/5" />
      <TooltipProvider delayDuration={0} skipDelayDuration={0}>
        <Dock className="z-50 pointer-events-auto relative mx-auto flex gap-3 min-h-full h-full items-center px-3 bg-background/40 backdrop-blur-xl border border-white/10 dark:border-white/[0.15] [box-shadow:0_0_0_1px_rgba(0,0,0,.03),0_2px_4px_rgba(0,0,0,.05),0_12px_24px_rgba(0,0,0,.05)] transform-gpu dark:[box-shadow:0_-20px_80px_-20px_#ffffff1f_inset,inset_0_1px_0_0_rgba(255,255,255,0.1)]">
          {NAV_ITEMS.map((item) => (
            <DockIcon key={item.href}>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Link
                    href={item.href}
                    className={cn(
                      buttonVariants({ variant: "ghost", size: "icon" }),
                      "size-12 transition-colors",
                    )}
                  >
                    <item.icon className="size-4" />
                  </Link>
                </TooltipTrigger>
                <TooltipContent>
                  <p>{item.label}</p>
                </TooltipContent>
              </Tooltip>
            </DockIcon>
          ))}
        </Dock>
      </TooltipProvider>
    </div>
  );
}
