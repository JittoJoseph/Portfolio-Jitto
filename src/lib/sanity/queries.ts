import { fallbackPortfolioData } from "./fallback";
import { getSanityClient } from "./client";
import type {
  ExperienceData,
  LinkItem,
  PortfolioData,
  ProfileData,
  ProjectData,
  SocialsData,
} from "./types";

type RawProfile = {
  fullName?: string;
  birthDate?: string;
  tagline?: string;
  bio?: string;
  headshotUrl?: string;
};

type RawSocials = {
  email?: string;
  linkedin?: string;
  github?: string;
  x?: string;
  resumeUrl?: string;
};

type RawProject = {
  _id: string;
  title?: string;
  description?: string;
  image?: string;
  tech?: string[];
  links?: LinkItem[];
  featured?: boolean;
  kind?: "personal" | "freelance";
  orderRank?: number;
};

type RawExperience = {
  _id: string;
  kind?: "career" | "education";
  company?: string;
  institution?: string;
  role?: string;
  degree?: string;
  period?: string;
  image?: string;
  bullets?: string[];
  links?: LinkItem[];
  orderRank?: number;
};

const profileQuery = `*[_type == "profile" && _id == "profile-main"][0]{
  fullName,
  birthDate,
  tagline,
  bio,
  "headshotUrl": headshot.asset->url
}`;

const socialsQuery = `*[_type == "socials" && _id == "socials-main"][0]{
  email,
  linkedin,
  github,
  x,
  "resumeUrl": resumeFile.asset->url
}`;

const projectsQuery = `*[_type == "project"]|order(orderRank asc){
  _id,
  title,
  description,
  "image": image.asset->url,
  tech,
  links,
  featured,
  kind,
  orderRank
}`;

const experienceQuery = `*[_type == "experience"]|order(orderRank asc){
  _id,
  kind,
  company,
  institution,
  role,
  degree,
  period,
  "image": image.asset->url,
  bullets,
  links,
  orderRank
}`;

function normalizeProfile(raw?: RawProfile | null): ProfileData | null {
  if (!raw || !raw.birthDate || !raw.tagline || !raw.bio) {
    return null;
  }

  return {
    fullName: raw.fullName || fallbackPortfolioData.profile.fullName,
    birthDate: raw.birthDate,
    tagline: raw.tagline,
    bio: raw.bio,
    headshotUrl: raw.headshotUrl || fallbackPortfolioData.profile.headshotUrl,
  };
}

function normalizeSocials(raw?: RawSocials | null): SocialsData | null {
  if (!raw?.email || !raw.linkedin || !raw.github || !raw.x || !raw.resumeUrl) {
    return null;
  }

  return {
    email: raw.email,
    linkedin: raw.linkedin,
    github: raw.github,
    x: raw.x,
    resumeUrl: raw.resumeUrl,
  };
}

function normalizeProjects(raw: RawProject[] = []): ProjectData[] {
  return raw
    .filter((item) => item.title && item.description && item.kind)
    .map((item, index) => ({
      _id: item._id,
      title: item.title as string,
      description: item.description as string,
      image: item.image,
      tech: item.tech ?? [],
      links: item.links ?? [],
      featured: item.featured ?? false,
      kind: item.kind as "personal" | "freelance",
      orderRank: item.orderRank ?? index,
    }));
}

function normalizeExperience(raw: RawExperience[] = []): ExperienceData[] {
  return raw
    .filter((item) => item.kind && item.period)
    .map((item, index) => ({
      _id: item._id,
      kind: item.kind as "career" | "education",
      company: item.company,
      institution: item.institution,
      role: item.role,
      degree: item.degree,
      period: item.period as string,
      image: item.image,
      bullets: item.bullets ?? [],
      links: item.links ?? [],
      orderRank: item.orderRank ?? index,
    }));
}

export async function getPortfolioData(): Promise<PortfolioData> {
  const client = getSanityClient();

  if (!client) {
    return fallbackPortfolioData;
  }

  const [rawProfile, rawSocials, rawProjects, rawExperience] = await Promise.all([
    client.fetch<RawProfile | null>(profileQuery),
    client.fetch<RawSocials | null>(socialsQuery),
    client.fetch<RawProject[]>(projectsQuery),
    client.fetch<RawExperience[]>(experienceQuery),
  ]);

  const profile = normalizeProfile(rawProfile);
  const socials = normalizeSocials(rawSocials);
  const projects = normalizeProjects(rawProjects);
  const experience = normalizeExperience(rawExperience);

  if (!profile || !socials || projects.length === 0 || experience.length === 0) {
    return fallbackPortfolioData;
  }

  const career = experience.filter((item) => item.kind === "career");
  const education = experience.filter((item) => item.kind === "education");

  if (career.length === 0 || education.length === 0) {
    return fallbackPortfolioData;
  }

  return {
    profile,
    socials,
    projects,
    career,
    education,
  };
}
