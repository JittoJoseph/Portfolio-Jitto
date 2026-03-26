import { defineCliConfig } from "sanity/cli";

const projectId =
  process.env.SANITY_STUDIO_PROJECT_ID ||
  process.env.NEXT_PUBLIC_SANITY_PROJECT_ID;
const dataset =
  process.env.SANITY_STUDIO_DATASET || process.env.NEXT_PUBLIC_SANITY_DATASET;
const studioHost = process.env.SANITY_STUDIO_HOST;

if (!projectId || !dataset) {
  throw new Error(
    "Missing SANITY_STUDIO_PROJECT_ID/NEXT_PUBLIC_SANITY_PROJECT_ID or SANITY_STUDIO_DATASET/NEXT_PUBLIC_SANITY_DATASET."
  );
}

export default defineCliConfig({
  api: {
    projectId,
    dataset,
  },
  ...(studioHost ? { studioHost } : {}),
});
