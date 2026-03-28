import fs from "node:fs";
import path from "node:path";
import { execFileSync } from "node:child_process";

const rootDir = process.cwd();
const musicDataFile = path.join(rootDir, "lib", "music-data.js");
const spotifyMapFile = path.join(rootDir, "data", "album-spotify-links.json");
const featuredSettingsFile = path.join(rootDir, "data", "featured-album-settings.json");
const market = process.env.SPOTIFY_MARKET || "US";

function normalize(value) {
  return value
    .toLowerCase()
    .normalize("NFKD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/&/g, " and ")
    .replace(/[^a-z0-9]+/g, " ")
    .trim();
}

function readJson(file) {
  if (!fs.existsSync(file)) {
    return {};
  }

  return JSON.parse(fs.readFileSync(file, "utf8"));
}

function writeJson(file, value) {
  fs.mkdirSync(path.dirname(file), { recursive: true });
  fs.writeFileSync(file, `${JSON.stringify(value, null, 2)}\n`);
}

function getArtistVariants(artist) {
  const stripped = artist
    .replace(/\bfeat(?:uring)?\b.*$/i, "")
    .replace(/\bwith\b.*$/i, "")
    .trim();

  return [...new Set([
    artist.trim(),
    stripped,
    stripped.split(/\s+[&/+]\s+|\s*,\s*|\s+and\s+/i)[0]?.trim() || ""
  ])].filter(Boolean);
}

function curlJson(args) {
  const output = execFileSync("curl", ["-L", "-sS", ...args], { encoding: "utf8" });

  try {
    return JSON.parse(output);
  } catch {
    throw new Error(`Non-JSON response from curl: ${output.slice(0, 200)}`);
  }
}

function curlStatus(url) {
  return execFileSync(
    "curl",
    ["-L", "-sS", "-o", "/dev/null", "-w", "%{http_code}", url],
    { encoding: "utf8" }
  ).trim();
}

function extractAlbumsFromSource() {
  const source = fs.readFileSync(musicDataFile, "utf8");
  const pattern =
    /slug:\s*"([^"]+)"[\s\S]{0,500}?title:\s*"([^"]+)"[\s\S]{0,500}?artist:\s*"([^"]+)"[\s\S]{0,200}?year:\s*"([^"]+)"/g;
  const albums = new Map();

  for (const match of source.matchAll(pattern)) {
    const [, slug, title, artist, year] = match;

    if (!albums.has(slug)) {
      albums.set(slug, { slug, title, artist, year });
    }
  }

  return [...albums.values()];
}

async function getAccessToken() {
  const clientId = process.env.SPOTIFY_CLIENT_ID;
  const clientSecret = process.env.SPOTIFY_CLIENT_SECRET;

  if (!clientId || !clientSecret) {
    throw new Error("Missing SPOTIFY_CLIENT_ID or SPOTIFY_CLIENT_SECRET.");
  }

  const credentials = Buffer.from(`${clientId}:${clientSecret}`).toString("base64");
  const data = curlJson([
    "-X",
    "POST",
    "https://accounts.spotify.com/api/token",
    "-H",
    `Authorization: Basic ${credentials}`,
    "-H",
    "Content-Type: application/x-www-form-urlencoded",
    "--data",
    "grant_type=client_credentials"
  ]);

  if (!data.access_token) {
    throw new Error("Spotify token request failed.");
  }

  return data.access_token;
}

async function searchAlbum(accessToken, artist, title) {
  const artistVariants = getArtistVariants(artist);
  const queries = [
    `album:${title} artist:${artist}`,
    ...artistVariants
      .filter((variant) => variant !== artist)
      .map((variant) => `album:${title} artist:${variant}`),
    `"${title}" "${artist}"`,
    ...artistVariants
      .filter((variant) => variant !== artist)
      .map((variant) => `"${title}" "${variant}"`),
    title
  ];

  const results = [];

  for (const query of queries) {
    const data = curlJson([
      "-H",
      `Authorization: Bearer ${accessToken}`,
      `https://api.spotify.com/v1/search?type=album&limit=10&market=${market}&q=${encodeURIComponent(
        query
      )}`
    ]);

    for (const item of data.albums?.items ?? []) {
      if (!results.some((existing) => existing.id === item.id)) {
        results.push(item);
      }
    }
  }

  return results;
}

function scoreAlbum(candidate, artist, title, year) {
  const normalizedArtist = normalize(artist);
  const artistVariants = getArtistVariants(artist).map((entry) => normalize(entry));
  const normalizedTitle = normalize(title);
  const candidateArtistNames = candidate.artists.map((entry) => normalize(entry.name));
  const candidateTitle = normalize(candidate.name);
  const candidateYear = candidate.release_date?.slice(0, 4) || "";

  let score = 0;

  if (candidateTitle === normalizedTitle) {
    score += 100;
  } else if (
    candidateTitle.includes(normalizedTitle) ||
    normalizedTitle.includes(candidateTitle)
  ) {
    score += 45;
  }

  if (candidateArtistNames.includes(normalizedArtist)) {
    score += 100;
  } else if (
    artistVariants.some((variant) => candidateArtistNames.includes(variant))
  ) {
    score += 90;
  } else if (
    candidateArtistNames.some((entry) =>
      artistVariants.some((variant) => entry.includes(variant) || variant.includes(entry))
    )
  ) {
    score += 45;
  }

  if (candidateYear === year) {
    score += 30;
  } else if (candidateYear && Math.abs(Number(candidateYear) - Number(year)) <= 1) {
    score += 15;
  }

  if (candidate.album_type === "album") {
    score += 10;
  }

  return score;
}

function pickBestAlbum(matches, artist, title, year) {
  const ranked = matches
    .map((candidate) => ({
      candidate,
      score: scoreAlbum(candidate, artist, title, year)
    }))
    .filter((entry) => entry.score >= 130)
    .sort((left, right) => right.score - left.score);

  return ranked[0]?.candidate ?? null;
}

async function validateSpotifyUrl(url) {
  return curlStatus(`https://open.spotify.com/oembed?url=${encodeURIComponent(url)}`) === "200";
}

async function main() {
  const albums = extractAlbumsFromSource();
  const accessToken = await getAccessToken();
  const currentMap = readJson(spotifyMapFile);
  const currentSettings = readJson(featuredSettingsFile);
  const nextMap = { ...currentMap };
  const nextSettings = { ...currentSettings };
  const resolved = [];
  const unresolved = [];

  for (const album of albums) {
    if (nextMap[album.slug]?.url) {
      if (typeof nextSettings[album.slug] !== "boolean") {
        nextSettings[album.slug] = true;
      }
      continue;
    }

    const matches = await searchAlbum(accessToken, album.artist, album.title);
    const best = pickBestAlbum(matches, album.artist, album.title, album.year);

    if (!best) {
      unresolved.push(`${album.slug}: ${album.artist} - ${album.title}`);
      continue;
    }

    const url = best.external_urls?.spotify;

    if (!url || !(await validateSpotifyUrl(url))) {
      unresolved.push(`${album.slug}: ${album.artist} - ${album.title}`);
      continue;
    }

    nextMap[album.slug] = {
      url,
      matchedTitle: best.name,
      matchedArtist: best.artists.map((entry) => entry.name).join(", "),
      matchedYear: best.release_date?.slice(0, 4) || ""
    };

    if (typeof nextSettings[album.slug] !== "boolean") {
      nextSettings[album.slug] = true;
    }

    resolved.push(`${album.slug}: ${album.artist} - ${album.title} -> ${url}`);
  }

  writeJson(spotifyMapFile, Object.fromEntries(Object.entries(nextMap).sort()));
  writeJson(featuredSettingsFile, Object.fromEntries(Object.entries(nextSettings).sort()));

  console.log(`Spotify album links stored: ${Object.keys(nextMap).length}`);
  console.log(`Resolved this pass: ${resolved.length}`);
  if (resolved.length > 0) {
    console.log(resolved.join("\n"));
  }

  console.log(`Unresolved albums remaining: ${unresolved.length}`);
  if (unresolved.length > 0) {
    console.log(unresolved.join("\n"));
  }
}

main().catch((error) => {
  console.error(error.message);
  process.exit(1);
});
