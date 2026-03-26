const clean = (value?: string) => {
  if (!value) {
    return undefined;
  }

  const trimmed = value.trim();
  return trimmed.length > 0 ? trimmed : undefined;
};

export const sanityEnv = {
  projectId: clean(
    process.env.NEXT_PUBLIC_SANITY_PROJECT_ID ||
      process.env.SANITY_STUDIO_PROJECT_ID
  ),
  dataset: clean(
    process.env.NEXT_PUBLIC_SANITY_DATASET || process.env.SANITY_STUDIO_DATASET
  ),
  apiVersion: clean(process.env.NEXT_PUBLIC_SANITY_API_VERSION) ?? "2025-03-01",
  readToken: clean(process.env.SANITY_API_READ_TOKEN),
} as const;

export const isSanityConfigured = Boolean(
  sanityEnv.projectId && sanityEnv.dataset
);
