import careerData from "@/data/career.json";
import educationData from "@/data/education.json";
import projectsData from "@/data/projects.json";
import freelanceData from "@/data/freelance-projects.json";
import socialsData from "@/data/socials.json";
import profileData from "@/data/profile.json";
import type { PortfolioData } from "./types";

export const fallbackPortfolioData: PortfolioData = {
  profile: {
    fullName: "Jitto Joseph",
    birthDate: profileData.birthDate,
    tagline: profileData.tagline,
    bio: profileData.bio,
    headshotUrl: "/headshot.jpg",
  },
  socials: {
    email: socialsData.email,
    linkedin: socialsData.linkedin,
    github: socialsData.github,
    x: socialsData.x,
    resumeUrl: socialsData.resume,
  },
  projects: projectsData.map((project, index) => ({
    _id: `fallback-personal-${index}`,
    title: project.title,
    description: project.description,
    image: project.image,
    tech: project.tech,
    links: project.links,
    featured: project.featured ?? false,
    kind: "personal" as const,
    orderRank: index,
  })),
  career: careerData.map((item, index) => ({
    _id: `fallback-career-${index}`,
    kind: "career" as const,
    company: item.company,
    role: item.role,
    period: item.period,
    image: item.image,
    bullets: item.bullets,
    links: item.links,
    orderRank: index,
  })),
  education: educationData.map((item, index) => ({
    _id: `fallback-education-${index}`,
    kind: "education" as const,
    institution: item.institution,
    degree: item.degree,
    period: item.period,
    image: item.image,
    bullets: item.bullets,
    links: item.links,
    orderRank: index,
  })),
};

fallbackPortfolioData.projects.push(
  ...freelanceData.map((project, index) => ({
    _id: `fallback-freelance-${index}`,
    title: project.title,
    description: project.description,
    image: project.image,
    tech: project.tech,
    links: project.links,
    featured: false,
    kind: "freelance" as const,
    orderRank: index,
  }))
);
