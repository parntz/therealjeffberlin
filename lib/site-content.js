import fs from "node:fs";
import path from "node:path";

export const SITE_CONTENT_OVERRIDES_PATH = path.join(
  process.cwd(),
  "data",
  "site-content-overrides.json"
);

export function readSiteContentOverrides() {
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

export function writeSiteContentOverrides(entries) {
  fs.mkdirSync(path.dirname(SITE_CONTENT_OVERRIDES_PATH), { recursive: true });
  fs.writeFileSync(
    SITE_CONTENT_OVERRIDES_PATH,
    JSON.stringify(entries, null, 2) + "\n"
  );
}

export function getSiteContentValue(contentId, fallback) {
  const overrides = readSiteContentOverrides();
  return typeof overrides[contentId] === "string" ? overrides[contentId] : fallback;
}
