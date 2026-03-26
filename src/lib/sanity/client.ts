import { createClient } from "@sanity/client";
import { isSanityConfigured, sanityEnv } from "./env";

let client: ReturnType<typeof createClient> | null = null;

export function getSanityClient() {
  if (!isSanityConfigured) {
    return null;
  }

  if (!client) {
    client = createClient({
      projectId: sanityEnv.projectId as string,
      dataset: sanityEnv.dataset as string,
      apiVersion: sanityEnv.apiVersion,
      useCdn: false,
      token: sanityEnv.readToken || undefined,
    });
  }

  return client;
}

export function clearSanityClientCache() {
  client = null;
}
