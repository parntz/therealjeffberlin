import fs from "node:fs";
import path from "node:path";
import { getStore } from "@netlify/blobs";

export const SITE_CONTENT_OVERRIDES_PATH = path.join(
  process.cwd(),
  "data",
  "site-content-overrides.json"
);
const SITE_CONTENT_KEY = "site-content-overrides";
const SITE_CONTENT_STORE = "site-admin";

function canUseNetlifyBlobs() {
  return Boolean(process.env.NETLIFY || process.env.NETLIFY_LOCAL);
}

function readLocalSiteContentOverrides() {
  if (!fs.existsSync(SITE_CONTENT_OVERRIDES_PATH)) {
    return {};
  }

  try {
    const parsed = JSON.parse(fs.readFileSync(SITE_CONTENT_OVERRIDES_PATH, "utf8"));
    return parsed && typeof parsed === "object" && !Array.isArray(parsed)
      ? parsed
      : {};
  } catch {
    return {};
  }
}

function writeLocalSiteContentOverrides(entries) {
  fs.mkdirSync(path.dirname(SITE_CONTENT_OVERRIDES_PATH), { recursive: true });
  fs.writeFileSync(
    SITE_CONTENT_OVERRIDES_PATH,
    JSON.stringify(entries, null, 2) + "\n"
  );
}

async function readBlobSiteContentOverrides() {
  if (!canUseNetlifyBlobs()) {
    return null;
  }

  const store = getStore(SITE_CONTENT_STORE);
  return store.get(SITE_CONTENT_KEY, { type: "json" });
}

async function writeBlobSiteContentOverrides(entries) {
  const store = getStore(SITE_CONTENT_STORE);
  await store.setJSON(SITE_CONTENT_KEY, entries);
}

export async function readSiteContentOverrides() {
  try {
    const blobPayload = await readBlobSiteContentOverrides();

    if (blobPayload && typeof blobPayload === "object" && !Array.isArray(blobPayload)) {
      return blobPayload;
    }
  } catch {
    // Fall back to the committed file when blob storage is unavailable.
  }

  return readLocalSiteContentOverrides();
}

export async function writeSiteContentOverrides(entries) {
  if (canUseNetlifyBlobs()) {
    await writeBlobSiteContentOverrides(entries);
    return;
  }

  writeLocalSiteContentOverrides(entries);
}

export function resolveSiteContentValue(entries, contentId, fallback) {
  return typeof entries?.[contentId] === "string" ? entries[contentId] : fallback;
}
