import socialsData from "@/data/socials.json";
import { GitHubIcon, LinkedInIcon, MailIcon } from "@/components/Icons";
import SocialLink from "@/components/SocialLink";

export default function Footer() {
  return (
    <footer className="mt-24 pt-8 border-t border-zinc-800">
      <div className="flex justify-center gap-6">
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
      <p className="text-center text-sm text-zinc-500 mt-4">
        © 2025 Jitto Joseph
      </p>
    </footer>
  );
}
