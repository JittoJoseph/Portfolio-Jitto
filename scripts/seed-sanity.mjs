import fs from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { createClient } from "@sanity/client";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootDir = path.resolve(__dirname, "..");

const projectId = process.env.SANITY_STUDIO_PROJECT_ID || process.env.NEXT_PUBLIC_SANITY_PROJECT_ID;
const dataset = process.env.SANITY_STUDIO_DATASET || process.env.NEXT_PUBLIC_SANITY_DATASET;
const token = process.env.SANITY_API_WRITE_TOKEN;
const apiVersion = process.env.NEXT_PUBLIC_SANITY_API_VERSION || "2025-03-01";

if (!projectId || !dataset || !token) {
  throw new Error(
    "Missing SANITY_STUDIO_PROJECT_ID/NEXT_PUBLIC_SANITY_PROJECT_ID, SANITY_STUDIO_DATASET/NEXT_PUBLIC_SANITY_DATASET, or SANITY_API_WRITE_TOKEN."
  );
}

const client = createClient({
  projectId,
  dataset,
  token,
  apiVersion,
  useCdn: false,
});

async function readJson(relativePath) {
  const filePath = path.join(rootDir, relativePath);
  return JSON.parse(await fs.readFile(filePath, "utf-8"));
}

async function uploadAsset(assetType, relativePath, fileName) {
  const filePath = path.join(rootDir, relativePath);
  const buffer = await fs.readFile(filePath);
  const ext = path.extname(fileName || relativePath).toLowerCase();
  const contentType =
    ext === ".pdf"
      ? "application/pdf"
      : ext === ".png"
        ? "image/png"
        : ext === ".jpg" || ext === ".jpeg"
          ? "image/jpeg"
          : "application/octet-stream";

  return client.assets.upload(assetType, buffer, {
    filename: fileName || path.basename(relativePath),
    contentType,
  });
}

function slugify(value) {
  return value
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "")
    .slice(0, 96);
}

async function seedSingletons() {
  const profile = await readJson("src/data/profile.json");
  const socials = await readJson("src/data/socials.json");

  const headshotAsset = await uploadAsset("image", "public/headshot.jpg", "headshot.jpg");
  const resumePath = socials.resume.startsWith("/") ? socials.resume.slice(1) : socials.resume;
  const resumeAsset = await uploadAsset("file", `public/${resumePath}`, path.basename(resumePath));

  await client.createOrReplace({
    _id: "profile-main",
    _type: "profile",
    fullName: "Jitto Joseph",
    birthDate: profile.birthDate,
    tagline: profile.tagline,
    bio: profile.bio,
    headshot: {
      _type: "image",
      asset: { _type: "reference", _ref: headshotAsset._id },
    },
  });

  await client.createOrReplace({
    _id: "socials-main",
    _type: "socials",
    email: socials.email,
    linkedin: socials.linkedin,
    github: socials.github,
    x: socials.x,
    resumeFile: {
      _type: "file",
      asset: { _type: "reference", _ref: resumeAsset._id },
    },
  });
}

async function createProjectDoc(project, kind, orderRank) {
  const imagePath = project.image?.startsWith("/") ? project.image.slice(1) : project.image;
  const imageAsset = imagePath
    ? await uploadAsset("image", `public/${imagePath}`, path.basename(imagePath))
    : null;

  return {
    _id: `project-${kind}-${slugify(project.title)}-${orderRank}`,
    _type: "project",
    title: project.title,
    slug: { _type: "slug", current: slugify(project.title) },
    kind,
    description: project.description,
    image: imageAsset
      ? {
          _type: "image",
          asset: { _type: "reference", _ref: imageAsset._id },
        }
      : undefined,
    tech: project.tech,
    links: project.links.map((link) => ({
      _type: "link",
      label: link.label,
      href: link.href,
      icon: link.icon ?? "link",
    })),
    featured: Boolean(project.featured),
    orderRank,
  };
}

async function createExperienceDoc(item, kind, orderRank) {
  const imagePath = item.image?.startsWith("/") ? item.image.slice(1) : item.image;
  const imageAsset = imagePath
    ? await uploadAsset("image", `public/${imagePath}`, path.basename(imagePath))
    : null;

  return {
    _id: `experience-${kind}-${slugify(item.company || item.institution || `item-${orderRank}`)}-${orderRank}`,
    _type: "experience",
    kind,
    company: item.company,
    institution: item.institution,
    role: item.role,
    degree: item.degree,
    period: item.period,
    image: imageAsset
      ? {
          _type: "image",
          asset: { _type: "reference", _ref: imageAsset._id },
        }
      : undefined,
    bullets: item.bullets || [],
    links: (item.links || []).map((link) => ({
      _type: "link",
      label: link.label,
      href: link.href,
      icon: link.icon ?? "link",
    })),
    orderRank,
  };
}

async function seedCollections() {
  const projects = await readJson("src/data/projects.json");
  const freelanceProjects = await readJson("src/data/freelance-projects.json");
  const career = await readJson("src/data/career.json");
  const education = await readJson("src/data/education.json");

  const projectDocs = [];

  for (let i = 0; i < projects.length; i += 1) {
    projectDocs.push(await createProjectDoc(projects[i], "personal", i));
  }

  for (let i = 0; i < freelanceProjects.length; i += 1) {
    projectDocs.push(await createProjectDoc(freelanceProjects[i], "freelance", i));
  }

  const experienceDocs = [];

  for (let i = 0; i < career.length; i += 1) {
    experienceDocs.push(await createExperienceDoc(career[i], "career", i));
  }

  for (let i = 0; i < education.length; i += 1) {
    experienceDocs.push(await createExperienceDoc(education[i], "education", i));
  }

  const transaction = client.transaction();

  for (const doc of [...projectDocs, ...experienceDocs]) {
    transaction.createOrReplace(doc);
  }

  await transaction.commit();
}

async function run() {
  console.log("Seeding Sanity content...");
  await seedSingletons();
  await seedCollections();
  console.log("Sanity seed complete.");
}

run().catch((error) => {
  console.error("Sanity seed failed:", error);
  process.exit(1);
});
