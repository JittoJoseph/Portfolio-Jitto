import Image from "next/image";
import Link from "next/link";
import {
  GitHubIcon,
  LinkedInIcon,
  MailIcon,
  FileTextIcon,
  XIcon,
} from "@/components/Icons";
import ExperienceTabs from "@/components/ExperienceTabs";
import Footer from "@/components/Footer";
import GitHubActivity from "@/components/GitHubActivity";
import PixelCompanion from "@/components/PixelCompanion";
import FloatingDock from "@/components/FloatingDock";
import Hackathons from "@/components/Hackathons";
import SocialLink from "@/components/SocialLink";
import ProjectsSection from "@/components/ProjectsSection";
import LatestCommits from "@/components/LatestCommits";
import { getGitHubContributionActivity } from "@/lib/github/activity";
import { getLatestCommits } from "@/lib/github/commits";
import { calculateAge } from "@/lib/utils";
import { getPortfolioData } from "@/lib/sanity/queries";

export const revalidate = 60;

export default async function Home() {
  const data = await getPortfolioData();
  const age = calculateAge(data.profile.birthDate);
  const tagline = data.profile.tagline.replace("{age}", age.toString());
  const personalProjects = data.projects.filter(
    (project) => project.kind === "personal",
  );
  const githubActivity = data.profile.showCodeActivity
    ? await getGitHubContributionActivity(data.socials.github)
    : null;
  const latestCommits = data.profile.showCodeActivity
    ? await getLatestCommits(data.socials.github)
    : [];
  const contributionTotal = githubActivity
    ? githubActivity.weeks.reduce((total, week) => {
        for (const day of week) {
          if (day) {
            total += day.count;
          }
        }
        return total;
      }, 0)
    : null;
  const contributionTotalText =
    contributionTotal !== null
      ? contributionTotal.toLocaleString("en-US")
      : null;

  return (
    <>
      <main
        id="home"
        className="min-h-screen bg-zinc-950 text-zinc-200 selection:bg-zinc-800 selection:text-zinc-100 font-sans"
      >
        <div className="mx-auto max-w-2xl px-6 pt-24 pb-8">
          {/* Hero Section */}
          <section className="mb-24 flex flex-col-reverse gap-8 md:flex-row md:items-center md:justify-between">
            <div className="flex-1 space-y-6">
              <h1 className="text-4xl font-bold tracking-tight text-zinc-100 sm:text-5xl">
                Hi, I&apos;m {data.profile.fullName}
              </h1>

              <div className="space-y-1">
                <p className="text-lg font-medium text-zinc-400">{tagline}</p>
                <p className="text-base text-zinc-500">{data.profile.bio}</p>
              </div>

              <div className="flex flex-wrap gap-4 pt-4">
                {/* Resume Button */}
                <Link
                  href={"/resume.pdf"}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 rounded-md bg-zinc-100 px-4 py-2 text-sm font-medium text-zinc-900 transition-colors hover:bg-zinc-200"
                >
                  <FileTextIcon className="h-4 w-4" />
                  Resume
                </Link>

                {/* Social Icons */}
                <div className="flex items-center gap-4 px-2">
                  <SocialLink
                    href={data.socials.linkedin}
                    icon={<LinkedInIcon />}
                    label="LinkedIn"
                  />
                  <SocialLink
                    href={data.socials.github}
                    icon={<GitHubIcon />}
                    label="GitHub"
                  />
                  <SocialLink
                    href={data.socials.x}
                    icon={<XIcon />}
                    label="X"
                  />
                  <SocialLink
                    href={`mailto:${data.socials.email}`}
                    icon={<MailIcon />}
                    label="Email"
                  />
                </div>
              </div>
            </div>
            <div className="relative h-32 w-32 overflow-hidden rounded-2xl md:h-40 md:w-40 bg-zinc-800 ring-2 ring-zinc-800 rotate-3 hover:rotate-0 transition-transform duration-300">
              <Image
                src={data.profile.headshotUrl}
                alt={data.profile.fullName}
                fill
                sizes="(min-width: 768px) 10rem, 8rem"
                className="object-cover"
                priority
              />
            </div>
          </section>

          {/* Experience & Education Tabs */}
          <section className="mb-16">
            <ExperienceTabs
              career={data.career}
              education={data.education}
              showExperienceDetails={data.profile.showExperienceDetails}
            />
          </section>

          {data.profile.showCodeActivity && (
            <section>
              <div className="mb-4 flex flex-wrap items-baseline justify-between gap-2">
                <h2 className="text-xl font-semibold text-zinc-100">
                  Code Activity
                </h2>
                {contributionTotalText ? (
                  <span className="text-sm text-zinc-400">
                    <span className="font-semibold tabular-nums text-zinc-200">
                      {contributionTotalText}
                    </span>{" "}
                    contribution{contributionTotal === 1 ? "" : "s"} in the last
                    year
                  </span>
                ) : (
                  <span className="text-sm text-zinc-400">
                    GitHub activity unavailable
                  </span>
                )}
              </div>
              <div className="rounded-2xl border border-zinc-800 bg-zinc-950 p-3">
                <GitHubActivity
                  githubProfileUrl={data.socials.github}
                  activity={githubActivity}
                />
              </div>
            </section>
          )}

          <ProjectsSection projects={personalProjects} />

          {latestCommits.length > 0 && (
            <section className="mb-20">
              <LatestCommits commits={latestCommits} />
            </section>
          )}

          <Hackathons recognitions={data.recognitions} />

          <section className="mb-20 text-center">
            <Link
              href={"https://www.linkedin.com/in/jittojoseph17/"}
              className="inline-flex items-center rounded-full bg-white px-4 py-2 text-sm font-medium text-black mb-6"
            >
              Contact
            </Link>
            <h2 className="text-3xl font-bold text-zinc-100 mb-4">
              Get in Touch
            </h2>
            <p className="text-lg text-zinc-400">
              Need help? Or just want to say hi?
              <br />
              DM on{" "}
              <Link
                href={data.socials.linkedin}
                target="_blank"
                className="text-blue-500 hover:text-blue-400 transition-colors"
              >
                LinkedIn
              </Link>
            </p>
          </section>

          <Footer socials={data.socials} />
        </div>
      </main>
      <FloatingDock />
      {data.profile.enablePixelCompanion && <PixelCompanion />}
    </>
  );
}
