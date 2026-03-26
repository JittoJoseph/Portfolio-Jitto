export type LinkItem = {
  label: string;
  href: string;
  icon?: string;
};

export type ProfileData = {
  fullName: string;
  birthDate: string;
  tagline: string;
  bio: string;
  headshotUrl: string;
};

export type SocialsData = {
  email: string;
  linkedin: string;
  github: string;
  x: string;
  resumeUrl: string;
};

export type ProjectData = {
  _id: string;
  title: string;
  description: string;
  image?: string | null;
  tech: string[];
  links: LinkItem[];
  featured?: boolean;
  kind: "personal" | "freelance";
  orderRank: number;
};

export type ExperienceData = {
  _id: string;
  kind: "career" | "education";
  company?: string;
  institution?: string;
  role?: string;
  degree?: string;
  period: string;
  image?: string | null;
  bullets: string[];
  links: LinkItem[];
  orderRank: number;
};

export type PortfolioData = {
  profile: ProfileData;
  socials: SocialsData;
  projects: ProjectData[];
  career: ExperienceData[];
  education: ExperienceData[];
};
