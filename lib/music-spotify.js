import fs from "node:fs";
import path from "node:path";

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

export function readFeaturedAlbumSettings() {
  return readJsonObject(FEATURED_ALBUM_SETTINGS_PATH);
}

export function writeFeaturedAlbumSettings(entries) {
  writeJsonObject(FEATURED_ALBUM_SETTINGS_PATH, entries);
}

export function toSpotifyEmbedUrl(value) {
  if (!value) {
    return "";
  }

  return value.replace("https://open.spotify.com/", "https://open.spotify.com/embed/");
}

export function mergeAlbumsWithSpotify(albums) {
  const spotifyLinks = readAlbumSpotifyLinks();
  const featuredSettings = readFeaturedAlbumSettings();

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
