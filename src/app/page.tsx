import Image from "next/image";
import Link from "next/link";
import careerData from "@/data/career.json";
import educationData from "@/data/education.json";
import projectsData from "@/data/projects.json";
import socialsData from "@/data/socials.json";
import profileData from "@/data/profile.json";
import {
  GitHubIcon,
  LinkedInIcon,
  MailIcon,
  FileTextIcon,
  ArrowRightIcon,
  XIcon,
} from "@/components/Icons";
import ExperienceTabs from "@/components/ExperienceTabs";
import ProjectCard from "@/components/ProjectCard";
import Footer from "@/components/Footer";
import SocialLink from "@/components/SocialLink";
import { calculateAge } from "@/lib/utils";

export default function Home() {
  const age = calculateAge(profileData.birthDate);
  const tagline = profileData.tagline.replace("{age}", age.toString());

  return (
    <main className="min-h-screen bg-zinc-950 text-zinc-200 selection:bg-zinc-800 selection:text-zinc-100 font-sans">
      <div className="mx-auto max-w-2xl px-6 pt-24 pb-8">
        {/* Hero Section */}
        <section className="mb-24 flex flex-col-reverse gap-8 md:flex-row md:items-center md:justify-between">
          <div className="flex-1 space-y-6">
            <h1 className="text-4xl font-bold tracking-tight text-zinc-100 sm:text-5xl">
              Hi, I'm Jitto Joseph
            </h1>

            <div className="space-y-1">
              <p className="text-lg font-medium text-zinc-400">{tagline}</p>
              <p className="text-base text-zinc-500">{profileData.bio}</p>
            </div>

            <div className="flex flex-wrap gap-4 pt-4">
              {/* Resume Button */}
              <a
                href={socialsData.resume}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 rounded-md bg-zinc-100 px-4 py-2 text-sm font-medium text-zinc-900 transition-colors hover:bg-zinc-200"
              >
                <FileTextIcon className="h-4 w-4" />
                Resume
              </a>

              {/* Social Icons */}
              <div className="flex items-center gap-4 px-2">
                <SocialLink
                  href={socialsData.linkedin}
                  icon={<LinkedInIcon />}
                  label="LinkedIn"
                />
                <SocialLink
                  href={socialsData.github}
                  icon={<GitHubIcon />}
                  label="GitHub"
                />
                <SocialLink href={socialsData.x} icon={<XIcon />} label="X" />
                <SocialLink
                  href={`mailto:${socialsData.email}`}
                  icon={<MailIcon />}
                  label="Email"
                />
              </div>
            </div>
          </div>
          <div className="relative h-32 w-32 overflow-hidden rounded-2xl md:h-40 md:w-40 bg-zinc-800 ring-2 ring-zinc-800 rotate-3 hover:rotate-0 transition-transform duration-300">
            <Image
              src="/profile-image.JPG"
              alt="Jitto Joseph"
              fill
              className="object-cover"
              priority
            />
          </div>
        </section>

        {/* Experience & Education Tabs */}
        <section className="mb-24">
          <ExperienceTabs career={careerData} education={educationData} />
        </section>

        {/* Projects Section */}
        <section className="mb-20">
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-xl font-semibold text-zinc-100">
              Featured Projects
            </h2>
            <Link
              href="/projects"
              className="text-sm text-zinc-400 hover:text-zinc-100 transition-colors flex items-center gap-1"
            >
              View All
              <ArrowRightIcon className="h-4 w-4" />
            </Link>
          </div>
          <div className="grid gap-6 sm:grid-cols-2">
            {projectsData
              .filter((project) => project.featured)
              .map((project, index) => (
                <ProjectCard key={index} project={project} />
              ))}
          </div>
        </section>

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
              href={socialsData.linkedin}
              target="_blank"
              className="text-blue-500 hover:text-blue-400 transition-colors"
            >
              LinkedIn
            </Link>
          </p>
        </section>

        <Footer />
      </div>
    </main>
  );
}
