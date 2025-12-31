import Image from "next/image";
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
} from "@/components/Icons";
import ExperienceTabs from "@/components/ExperienceTabs";
import { calculateAge } from "@/lib/utils";

export default function Home() {
  const age = calculateAge(profileData.birthDate);
  const tagline = profileData.tagline.replace("{age}", age.toString());

  return (
    <main className="min-h-screen bg-zinc-950 text-zinc-200 selection:bg-zinc-800 selection:text-zinc-100 font-sans">
      <div className="mx-auto max-w-2xl px-6 py-24 md:py-32">
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
              src="/IMG_7275~2.JPG"
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
          <h2 className="mb-8 text-xl font-semibold text-zinc-100">Projects</h2>
          <div className="grid gap-6 sm:grid-cols-2">
            {projectsData.map((project, index) => (
              <a
                key={index}
                href={project.link}
                target="_blank"
                rel="noopener noreferrer"
                className="group block rounded-xl border border-zinc-800 bg-zinc-900/50 p-5 transition-all hover:bg-zinc-900 hover:border-zinc-700 hover:shadow-lg hover:shadow-zinc-900/20"
              >
                <h3 className="font-medium text-zinc-100 group-hover:text-blue-400 transition-colors">
                  {project.title}
                </h3>
                <p className="mt-2 text-sm text-zinc-400 line-clamp-2 h-10">
                  {project.description}
                </p>
                <div className="mt-4 flex flex-wrap gap-2">
                  {project.tech.map((t) => (
                    <span
                      key={t}
                      className="rounded-md bg-zinc-800 px-2 py-1 text-[10px] font-medium text-zinc-400 uppercase tracking-wider"
                    >
                      {t}
                    </span>
                  ))}
                </div>
              </a>
            ))}
          </div>
        </section>
      </div>
    </main>
  );
}

function SocialLink({
  href,
  icon,
  label,
}: {
  href: string;
  icon: React.ReactNode;
  label: string;
}) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className="text-zinc-400 transition-colors hover:text-zinc-100"
      aria-label={label}
    >
      {icon}
    </a>
  );
}
