import fs from "node:fs";
import path from "node:path";
import { getStore } from "@netlify/blobs";

export const ALBUM_SPOTIFY_LINKS_PATH = path.join(
  process.cwd(),
  "data",
  "album-spotify-links.json"
);

export const FEATURED_ALBUM_SETTINGS_PATH = path.join(
  process.cwd(),
  "data",
  "featured-album-settings.json"
);
const FEATURED_ALBUM_SETTINGS_KEY = "featured-album-settings";
const FEATURED_ALBUM_SETTINGS_STORE = "music-admin";

function readJsonObject(filepath) {
  if (!fs.existsSync(filepath)) {
    return {};
  }

  try {
    const parsed = JSON.parse(fs.readFileSync(filepath, "utf8"));
    return parsed && typeof parsed === "object" && !Array.isArray(parsed)
      ? parsed
      : {};
  } catch {
    return {};
  }
}

function writeJsonObject(filepath, entries) {
  fs.mkdirSync(path.dirname(filepath), { recursive: true });
  fs.writeFileSync(filepath, JSON.stringify(entries, null, 2) + "\n");
}

export function readAlbumSpotifyLinks() {
  return readJsonObject(ALBUM_SPOTIFY_LINKS_PATH);
}

export function writeAlbumSpotifyLinks(entries) {
  writeJsonObject(ALBUM_SPOTIFY_LINKS_PATH, entries);
}

function canUseNetlifyBlobs() {
  return Boolean(process.env.NETLIFY || process.env.NETLIFY_LOCAL);
}

async function readBlobFeaturedAlbumSettings() {
  if (!canUseNetlifyBlobs()) {
    return null;
  }

  const store = getStore(FEATURED_ALBUM_SETTINGS_STORE);
  return store.get(FEATURED_ALBUM_SETTINGS_KEY, { type: "json" });
}

async function writeBlobFeaturedAlbumSettings(entries) {
  const store = getStore(FEATURED_ALBUM_SETTINGS_STORE);
  await store.setJSON(FEATURED_ALBUM_SETTINGS_KEY, entries);
}

export async function readFeaturedAlbumSettings() {
  try {
    const blobPayload = await readBlobFeaturedAlbumSettings();

    if (blobPayload && typeof blobPayload === "object" && !Array.isArray(blobPayload)) {
      return blobPayload;
    }
  } catch {
    // Fall back to local JSON when blobs are unavailable.
  }

  return readJsonObject(FEATURED_ALBUM_SETTINGS_PATH);
}

export async function writeFeaturedAlbumSettings(entries) {
  if (canUseNetlifyBlobs()) {
    await writeBlobFeaturedAlbumSettings(entries);
    return;
  }

  writeJsonObject(FEATURED_ALBUM_SETTINGS_PATH, entries);
}

export function toSpotifyEmbedUrl(value) {
  if (!value) {
    return "";
  }

  return value.replace("https://open.spotify.com/", "https://open.spotify.com/embed/");
}

export async function mergeAlbumsWithSpotify(albums) {
  const spotifyLinks = readAlbumSpotifyLinks();
  const featuredSettings = await readFeaturedAlbumSettings();

  return albums.map((album) => {
    const spotify = spotifyLinks[album.slug];
    const spotifyUrl = spotify?.url || "";

    return {
      ...album,
      spotifyUrl,
      spotifyEmbedUrl: toSpotifyEmbedUrl(spotifyUrl),
      spotifyFeaturedEligible: spotifyUrl
        ? featuredSettings[album.slug] !== false
        : false
    };
  });
}
