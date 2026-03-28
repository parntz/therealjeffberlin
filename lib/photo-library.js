import crypto from "node:crypto";
import fs from "node:fs";
import path from "node:path";
import { getStore } from "@netlify/blobs";

export const DELETED_PHOTOS_PATH = path.join(
  process.cwd(),
  "data",
  "deleted-photos.json"
);

export const PHOTO_OVERRIDES_PATH = path.join(
  process.cwd(),
  "data",
  "photo-overrides.json"
);
const DELETED_PHOTOS_KEY = "deleted-photos";
const PHOTO_OVERRIDES_KEY = "photo-overrides";
const PHOTO_ADMIN_STORE = "photo-admin";

export function canUseNetlifyBlobs() {
  return Boolean(process.env.NETLIFY || process.env.NETLIFY_LOCAL);
}

export function titleFromFilename(filename) {
  const stem = filename.replace(/\.[^.]+$/, "");

  return stem
    .replace(/^harvest-\d+-?/, "")
    .replace(/^jeff-berlin-/, "")
    .replace(/^jeff-/, "")
    .replace(/[-_]+/g, " ")
    .replace(/\b\w/g, (char) => char.toUpperCase()) || "Jeff Berlin Photo";
}

export function isRealImageFile(filepath) {
  const header = fs.readFileSync(filepath).subarray(0, 12);
  const isJpeg = header[0] === 0xff && header[1] === 0xd8 && header[2] === 0xff;
  const isPng =
    header[0] === 0x89 &&
    header[1] === 0x50 &&
    header[2] === 0x4e &&
    header[3] === 0x47;
  const isWebp =
    header[0] === 0x52 &&
    header[1] === 0x49 &&
    header[2] === 0x46 &&
    header[3] === 0x46 &&
    header[8] === 0x57 &&
    header[9] === 0x45 &&
    header[10] === 0x42 &&
    header[11] === 0x50;

  return isJpeg || isPng || isWebp;
}

function readLocalDeletedPhotos() {
  if (!fs.existsSync(DELETED_PHOTOS_PATH)) {
    return [];
  }

  try {
    const parsed = JSON.parse(fs.readFileSync(DELETED_PHOTOS_PATH, "utf8"));
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

function readLocalPhotoOverrides() {
  if (!fs.existsSync(PHOTO_OVERRIDES_PATH)) {
    return {};
  }

  try {
    const parsed = JSON.parse(fs.readFileSync(PHOTO_OVERRIDES_PATH, "utf8"));
    return parsed && typeof parsed === "object" && !Array.isArray(parsed)
      ? parsed
      : {};
  } catch {
    return {};
  }
}

function writeLocalPhotoOverrides(entries) {
  fs.mkdirSync(path.dirname(PHOTO_OVERRIDES_PATH), { recursive: true });
  fs.writeFileSync(PHOTO_OVERRIDES_PATH, JSON.stringify(entries, null, 2) + "\n");
}

function writeLocalDeletedPhotos(entries) {
  fs.mkdirSync(path.dirname(DELETED_PHOTOS_PATH), { recursive: true });
  fs.writeFileSync(DELETED_PHOTOS_PATH, JSON.stringify(entries, null, 2) + "\n");
}

async function readBlobDeletedPhotos() {
  if (!canUseNetlifyBlobs()) {
    return null;
  }

  const store = getStore(PHOTO_ADMIN_STORE);
  return store.get(DELETED_PHOTOS_KEY, { type: "json" });
}

async function readBlobPhotoOverrides() {
  if (!canUseNetlifyBlobs()) {
    return null;
  }

  const store = getStore(PHOTO_ADMIN_STORE);
  return store.get(PHOTO_OVERRIDES_KEY, { type: "json" });
}

async function writeBlobDeletedPhotos(entries) {
  const store = getStore(PHOTO_ADMIN_STORE);
  await store.setJSON(DELETED_PHOTOS_KEY, entries);
}

async function writeBlobPhotoOverrides(entries) {
  const store = getStore(PHOTO_ADMIN_STORE);
  await store.setJSON(PHOTO_OVERRIDES_KEY, entries);
}

export async function readDeletedPhotos() {
  try {
    const blobPayload = await readBlobDeletedPhotos();
    if (Array.isArray(blobPayload)) {
      return blobPayload;
    }
  } catch {
    // Fall back to local JSON when blobs are unavailable.
  }

  return readLocalDeletedPhotos();
}

export async function readPhotoOverrides() {
  try {
    const blobPayload = await readBlobPhotoOverrides();
    if (blobPayload && typeof blobPayload === "object" && !Array.isArray(blobPayload)) {
      return blobPayload;
    }
  } catch {
    // Fall back to local JSON when blobs are unavailable.
  }

  return readLocalPhotoOverrides();
}

export async function writePhotoOverrides(entries) {
  if (canUseNetlifyBlobs()) {
    await writeBlobPhotoOverrides(entries);
    return;
  }

  writeLocalPhotoOverrides(entries);
}

export async function writeDeletedPhotos(entries) {
  if (canUseNetlifyBlobs()) {
    await writeBlobDeletedPhotos(entries);
    return;
  }

  writeLocalDeletedPhotos(entries);
}

export function sha256File(filepath) {
  const file = fs.readFileSync(filepath);
  return crypto.createHash("sha256").update(file).digest("hex");
}

export function publicPathToFilepath(publicPath) {
  if (!publicPath.startsWith("/")) {
    throw new Error("Expected a public path");
  }

  const relativePath = publicPath.replace(/^\/+/, "");
  const resolvedPath = path.resolve(process.cwd(), "public", relativePath);
  const publicRoot = path.resolve(process.cwd(), "public");

  if (!resolvedPath.startsWith(publicRoot + path.sep) && resolvedPath !== publicRoot) {
    throw new Error("Path escapes public directory");
  }

  return resolvedPath;
}

export function isUsedInMusicArea(imagePath) {
  const musicFiles = [
    path.join(process.cwd(), "lib", "music-data.js"),
    path.join(process.cwd(), "app", "music", "[slug]", "page.js"),
    path.join(process.cwd(), "components", "site-sections.js")
  ];

  return musicFiles.some((filepath) => {
    if (!fs.existsSync(filepath)) {
      return false;
    }

    return fs.readFileSync(filepath, "utf8").includes(imagePath);
  });
}
