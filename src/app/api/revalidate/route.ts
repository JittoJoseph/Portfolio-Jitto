import { timingSafeEqual } from "node:crypto";
import { revalidatePath, revalidateTag } from "next/cache";
import { NextResponse } from "next/server";
import { sanityEnv } from "@/lib/sanity/env";
import { SANITY_PORTFOLIO_TAG } from "@/lib/sanity/queries";

export const runtime = "nodejs";

const REVALIDATED_PATHS = ["/", "/projects"] as const;

function getRequestSecret(request: Request) {
  const authorization = request.headers.get("authorization");

  if (authorization?.startsWith("Bearer ")) {
    return authorization.slice("Bearer ".length).trim();
  }

  return (
    request.headers.get("x-webhook-secret") ??
    request.headers.get("sanity-webhook-secret") ??
    new URL(request.url).searchParams.get("secret")
  );
}

function secretsMatch(incomingSecret: string, expectedSecret: string) {
  const incoming = Buffer.from(incomingSecret);
  const expected = Buffer.from(expectedSecret);

  return (
    incoming.length === expected.length && timingSafeEqual(incoming, expected)
  );
}

export async function POST(request: Request) {
  const expectedSecret = sanityEnv.webhookSecret;

  if (!expectedSecret) {
    return NextResponse.json(
      { revalidated: false, message: "Missing SANITY_WEBHOOK_SECRET" },
      { status: 500 }
    );
  }

  const incomingSecret = getRequestSecret(request);

  if (!incomingSecret || !secretsMatch(incomingSecret, expectedSecret)) {
    return NextResponse.json(
      { revalidated: false, message: "Invalid revalidation secret" },
      { status: 401 }
    );
  }

  revalidateTag(SANITY_PORTFOLIO_TAG, { expire: 0 });

  for (const path of REVALIDATED_PATHS) {
    revalidatePath(path, "page");
  }

  return NextResponse.json({
    revalidated: true,
    tag: SANITY_PORTFOLIO_TAG,
    paths: REVALIDATED_PATHS,
    revalidatedAt: new Date().toISOString(),
  });
}
