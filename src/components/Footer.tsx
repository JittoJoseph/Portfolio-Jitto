import { GitHubIcon, LinkedInIcon, MailIcon, XIcon } from "@/components/Icons";
import SocialLink from "@/components/SocialLink";
import type { SocialsData } from "@/lib/sanity/types";

export default function Footer({ socials }: { socials: SocialsData }) {
  return (
    <footer className="mt-24 pt-8 border-t border-zinc-800">
      <div className="flex justify-center gap-6">
        <SocialLink
          href={socials.linkedin}
          icon={<LinkedInIcon />}
          label="LinkedIn"
        />
        <SocialLink
          href={socials.github}
          icon={<GitHubIcon />}
          label="GitHub"
        />
        <SocialLink href={socials.x} icon={<XIcon />} label="X" />
        <SocialLink
          href={`mailto:${socials.email}`}
          icon={<MailIcon />}
          label="Email"
        />
      </div>
      <p className="text-center text-sm text-zinc-500 mt-4">
        © {new Date().getFullYear()} Jitto Joseph
      </p>
    </footer>
  );
}
