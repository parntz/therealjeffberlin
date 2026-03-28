import { syncVideosArchive } from "../../lib/videos-archive.js";

function json(statusCode, body) {
  return {
    statusCode,
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify(body)
  };
}

export async function handler(event) {
  if (event.httpMethod !== "POST") {
    return json(405, { error: "Method not allowed." });
  }

  try {
    const payload = await syncVideosArchive();

    return json(202, {
      ok: true,
      videoCount: payload.videoCount,
      fetchedAt: payload.fetchedAt
    });
  } catch (error) {
    return json(500, {
      error: error instanceof Error ? error.message : "Video sync failed."
    });
  }
}
