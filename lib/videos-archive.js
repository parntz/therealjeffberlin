import fs from "node:fs";
import path from "node:path";

import { getStore } from "@netlify/blobs";

const ARCHIVE_KEY = "jeff-berlin-youtube-archive";
const ARCHIVE_STORE = "videos-archive";
const CHANNEL_HANDLE = "@jeffberlin2.0";
const USER_AGENT =
  "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/123.0.0.0 Safari/537.36";

const COLLECTIONS = [
  {
    key: "videos",
    label: "Videos",
    url: `https://www.youtube.com/${CHANNEL_HANDLE}/videos`,
    mediaType: "video"
  },
  {
    key: "shorts",
    label: "Shorts",
    url: `https://www.youtube.com/${CHANNEL_HANDLE}/shorts`,
    mediaType: "short"
  }
];
const TRANSCRIPT_REPAIR_LIMIT = 4;
let shortThumbnailSourceDataUrl = null;

function localArchivePath() {
  return path.join(process.cwd(), "data", "jeff-berlin-videos.json");
}

function shortThumbnailSourcePath() {
  return path.join(
    process.cwd(),
    "public",
    "images",
    "videos",
    "source",
    "dani-rabin-base.jpg"
  );
}

export function readLocalVideosArchive() {
  const filePath = localArchivePath();

  if (!fs.existsSync(filePath)) {
    return {
      channelTitle: "Jeff Berlin - YouTube Archive",
      channelUrl: `https://www.youtube.com/${CHANNEL_HANDLE}`,
      fetchedAt: new Date().toISOString(),
      collections: [],
      videoCount: 0,
      videos: []
    };
  }

  return JSON.parse(fs.readFileSync(filePath, "utf-8"));
}

function canUseNetlifyBlobs() {
  return Boolean(process.env.NETLIFY || process.env.NETLIFY_LOCAL);
}

async function readBlobVideosArchive() {
  if (!canUseNetlifyBlobs()) {
    return null;
  }

  const store = getStore(ARCHIVE_STORE);
  return store.get(ARCHIVE_KEY, { type: "json" });
}

async function writeBlobVideosArchive(payload) {
  const store = getStore(ARCHIVE_STORE);
  await store.setJSON(ARCHIVE_KEY, payload);
}

export async function readVideosArchive() {
  try {
    const blobPayload = await readBlobVideosArchive();

    if (blobPayload) {
      return blobPayload;
    }
  } catch {
    // Fall back to the committed dataset outside Netlify runtime.
  }

  return readLocalVideosArchive();
}

async function fetchText(url) {
  const response = await fetch(url, {
    headers: {
      "User-Agent": USER_AGENT,
      "Accept-Language": "en-US,en;q=0.9"
    }
  });

  if (!response.ok) {
    throw new Error(`Fetch failed for ${url}: ${response.status}`);
  }

  return response.text();
}

function extractJsonAssignment(html, marker) {
  const markerIndex = html.indexOf(marker);

  if (markerIndex === -1) {
    return null;
  }

  const startIndex = html.indexOf("{", markerIndex);

  if (startIndex === -1) {
    return null;
  }

  let depth = 0;
  let inString = false;
  let escaped = false;

  for (let index = startIndex; index < html.length; index += 1) {
    const char = html[index];

    if (inString) {
      if (escaped) {
        escaped = false;
      } else if (char === "\\") {
        escaped = true;
      } else if (char === "\"") {
        inString = false;
      }

      continue;
    }

    if (char === "\"") {
      inString = true;
      continue;
    }

    if (char === "{") {
      depth += 1;
    } else if (char === "}") {
      depth -= 1;

      if (depth === 0) {
        try {
          return JSON.parse(html.slice(startIndex, index + 1));
        } catch {
          return null;
        }
      }
    }
  }

  return null;
}

function extractVideoIds(html) {
  const ids = new Set();
  const matches = html.matchAll(/"videoId":"([A-Za-z0-9_-]{11})"/g);

  for (const match of matches) {
    ids.add(match[1]);
  }

  return Array.from(ids);
}

function pickBestThumbnail(thumbnails) {
  if (!thumbnails?.length) {
    return {
      url: null,
      width: null,
      height: null
    };
  }

  const best = [...thumbnails].sort((left, right) => {
    const leftArea = (left.width || 0) * (left.height || 0);
    const rightArea = (right.width || 0) * (right.height || 0);

    return leftArea - rightArea;
  })[thumbnails.length - 1];

  return {
    url: best.url || null,
    width: best.width || null,
    height: best.height || null
  };
}

function escapeXml(value) {
  return String(value)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll("\"", "&quot;")
    .replaceAll("'", "&apos;");
}

function wrapTitle(title, maxCharsPerLine = 20, maxLines = 3) {
  const words = title
    .replace(/\s+/g, " ")
    .trim()
    .split(" ")
    .filter(Boolean);
  const lines = [];
  let currentLine = "";
  let wordIndex = 0;

  for (const word of words) {
    wordIndex += 1;
    const candidate = currentLine ? `${currentLine} ${word}` : word;

    if (candidate.length <= maxCharsPerLine || !currentLine) {
      currentLine = candidate;
      continue;
    }

    lines.push(currentLine);
    currentLine = word;

    if (lines.length === maxLines - 1) {
      break;
    }
  }

  const remainingWords = words.slice(wordIndex);
  const tail = currentLine
    ? [currentLine, ...remainingWords].join(" ").trim()
    : remainingWords.join(" ").trim();

  if (tail) {
    lines.push(tail);
  }

  return lines.slice(0, maxLines).map((line, index, array) => {
    if (index !== array.length - 1 || line.length <= maxCharsPerLine) {
      return line;
    }

    return line.length > maxCharsPerLine ? `${line.slice(0, maxCharsPerLine - 1).trim()}…` : line;
  });
}

function getShortThumbnailSourceDataUrl() {
  if (shortThumbnailSourceDataUrl) {
    return shortThumbnailSourceDataUrl;
  }

  const source = fs.readFileSync(shortThumbnailSourcePath());
  shortThumbnailSourceDataUrl = `data:image/jpeg;base64,${source.toString("base64")}`;
  return shortThumbnailSourceDataUrl;
}

function buildShortThumbnailDataUrl(title) {
  const lines = wrapTitle(title);
  const sourceDataUrl = getShortThumbnailSourceDataUrl();
  const titleSpans = lines
    .map(
      (line, index) =>
        `<tspan x="128" dy="${index === 0 ? 0 : 110}">${escapeXml(line)}</tspan>`
    )
    .join("");

  const svg = `
    <svg xmlns="http://www.w3.org/2000/svg" width="1280" height="720" viewBox="0 0 1280 720">
      <image href="${sourceDataUrl}" width="1280" height="720" preserveAspectRatio="xMidYMid slice" />
      <rect x="0" y="0" width="760" height="360" fill="#000000" />
      <rect x="0" y="560" width="1280" height="160" fill="#000000" />
      <text
        x="128"
        y="160"
        fill="#ffd233"
        font-family="Arial Black, Arial, Helvetica, sans-serif"
        font-size="82"
        font-weight="900"
      >
        ${titleSpans}
      </text>
      <text
        x="132"
        y="650"
        fill="#ffffff"
        font-family="Avenir Next Condensed, Avenir Next, Arial Narrow, Arial, sans-serif"
        font-size="52"
        font-weight="700"
      >
        Driving Lessons |
      </text>
      <text
        x="602"
        y="650"
        fill="#ffd233"
        font-family="Avenir Next Condensed, Avenir Next, Arial Narrow, Arial, sans-serif"
        font-size="52"
        font-weight="700"
      >
        youtube short
      </text>
    </svg>
  `.trim();

  return `data:image/svg+xml;base64,${Buffer.from(svg).toString("base64")}`;
}

function parseJson3Transcript(payload) {
  const segments = [];

  for (const event of payload.events || []) {
    const text = (event.segs || [])
      .map((segment) => segment.utf8 || "")
      .join("")
      .replace(/\s+/g, " ")
      .trim();

    if (!text) {
      continue;
    }

    segments.push({
      text,
      start: Math.round(((event.tStartMs || 0) / 1000) * 1000) / 1000,
      duration:
        Math.round((((event.dDurationMs || 0) / 1000) || 0) * 1000) / 1000
    });
  }

  return {
    status: "ok",
    language: "English",
    languageCode: "en",
    text: segments.map((segment) => segment.text).join(" ").trim(),
    segments
  };
}

async function fetchTranscriptFromPlayerResponse(playerResponse, fallbackTranscript) {
  if (fallbackTranscript?.status === "ok" && fallbackTranscript.text) {
    return fallbackTranscript;
  }

  const captionTracks =
    playerResponse?.captions?.playerCaptionsTracklistRenderer?.captionTracks || [];

  const englishTrack =
    captionTracks.find((track) => track.languageCode === "en") ||
    captionTracks.find((track) => track.vssId?.includes(".en")) ||
    captionTracks[0];

  if (!englishTrack?.baseUrl) {
    return {
      status: "unavailable",
      language: null,
      languageCode: null,
      text: "",
      segments: [],
      error: "No caption track available."
    };
  }

  const transcriptUrl = englishTrack.baseUrl.includes("fmt=")
    ? englishTrack.baseUrl
    : `${englishTrack.baseUrl}&fmt=json3`;

  try {
    const response = await fetch(transcriptUrl, {
      headers: {
        "User-Agent": USER_AGENT,
        "Accept-Language": "en-US,en;q=0.9"
      }
    });

    if (!response.ok) {
      throw new Error(`Transcript fetch failed with ${response.status}`);
    }

    const payload = await response.json();
    return parseJson3Transcript(payload);
  } catch (error) {
    return {
      status: "unavailable",
      language: null,
      languageCode: null,
      text: "",
      segments: [],
      error: error instanceof Error ? error.message : "Transcript fetch failed."
    };
  }
}

async function fetchVideoRecord(videoId, collection, fallbackVideo) {
  const html = await fetchText(`https://www.youtube.com/watch?v=${videoId}`);
  const playerResponse =
    extractJsonAssignment(html, "var ytInitialPlayerResponse = ") ||
    extractJsonAssignment(html, "ytInitialPlayerResponse = ");

  if (!playerResponse?.videoDetails) {
    throw new Error(`Unable to parse player response for ${videoId}`);
  }

  const details = playerResponse.videoDetails;
  const microformat = playerResponse.microformat?.playerMicroformatRenderer || {};
  const thumbnail = pickBestThumbnail(details.thumbnail?.thumbnails || []);
  const transcript = await fetchTranscriptFromPlayerResponse(
    playerResponse,
    fallbackVideo?.transcript || null
  );
  const customThumbnailUrl =
    collection.mediaType === "short"
      ? fallbackVideo?.customThumbnailUrl || buildShortThumbnailDataUrl(details.title || "Untitled")
      : fallbackVideo?.customThumbnailUrl || null;

  return {
    id: videoId,
    collectionKey: collection.key,
    collectionLabel: collection.label,
    mediaType: collection.mediaType,
    title: details.title || "Untitled",
    description: details.shortDescription || "",
    duration: Number.parseInt(details.lengthSeconds || "0", 10) || null,
    durationString: microformat.lengthSeconds
      ? null
      : null,
    publishedAt: microformat.publishDate || microformat.uploadDate || null,
    url: `https://www.youtube.com/watch?v=${videoId}`,
    embedUrl: `https://www.youtube.com/embed/${videoId}`,
    thumbnailUrl: thumbnail.url,
    thumbnailWidth: thumbnail.width,
    thumbnailHeight: thumbnail.height,
    customThumbnailUrl,
    transcript
  };
}

function formatDuration(totalSeconds) {
  if (!totalSeconds && totalSeconds !== 0) {
    return null;
  }

  const hours = Math.floor(totalSeconds / 3600);
  const minutes = Math.floor((totalSeconds % 3600) / 60);
  const seconds = totalSeconds % 60;

  if (hours > 0) {
    return `${hours}:${String(minutes).padStart(2, "0")}:${String(seconds).padStart(2, "0")}`;
  }

  return `${minutes}:${String(seconds).padStart(2, "0")}`;
}

function normalizeVideoRecord(video) {
  return {
    ...video,
    durationString:
      video.durationString || formatDuration(video.duration) || "Unknown length"
  };
}

function buildCollections(videos) {
  return COLLECTIONS.map((collection) => ({
    key: collection.key,
    label: collection.label,
    url: collection.url,
    count: videos.filter((video) => video.collectionKey === collection.key).length
  }));
}

function sortVideos(videos) {
  return [...videos].sort((left, right) => {
    const leftDate = left.publishedAt || "";
    const rightDate = right.publishedAt || "";

    if (leftDate !== rightDate) {
      return rightDate.localeCompare(leftDate);
    }

    return left.title.localeCompare(right.title);
  });
}

export async function syncVideosArchive() {
  const currentArchive = await readVideosArchive();
  const currentVideos = currentArchive.videos || [];
  const videoMap = new Map(currentVideos.map((video) => [video.id, video]));
  let repairedTranscripts = 0;

  for (const collection of COLLECTIONS) {
    const html = await fetchText(collection.url);
    const discoveredIds = extractVideoIds(html);

    for (const videoId of discoveredIds) {
      const existingVideo = videoMap.get(videoId);
      const shortNeedsCustomThumbnail =
        collection.mediaType === "short" && !existingVideo?.customThumbnailUrl;

      if (
        existingVideo &&
        !shortNeedsCustomThumbnail &&
        (existingVideo.transcript?.status === "ok" || repairedTranscripts >= TRANSCRIPT_REPAIR_LIMIT)
      ) {
        continue;
      }

      const record = await fetchVideoRecord(videoId, collection, existingVideo || null);
      videoMap.set(videoId, normalizeVideoRecord(record));

      if (existingVideo && record.transcript?.status === "ok") {
        repairedTranscripts += 1;
      }
    }
  }

  const payload = {
    channelTitle: "Jeff Berlin - YouTube Archive",
    channelUrl: `https://www.youtube.com/${CHANNEL_HANDLE}`,
    fetchedAt: new Date().toISOString(),
    collections: buildCollections(Array.from(videoMap.values())),
    videoCount: videoMap.size,
    videos: sortVideos(Array.from(videoMap.values())).map(normalizeVideoRecord)
  };

  if (canUseNetlifyBlobs()) {
    await writeBlobVideosArchive(payload);
  }

  return payload;
}
