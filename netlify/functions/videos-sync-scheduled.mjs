function json(statusCode, body) {
  return {
    statusCode,
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify(body)
  };
}

export const config = {
  schedule: "15 7 * * *"
};

export async function handler() {
  const baseUrl =
    process.env.URL || process.env.DEPLOY_PRIME_URL || process.env.DEPLOY_URL;

  if (!baseUrl) {
    return json(500, { error: "Netlify site URL is not available." });
  }

  const response = await fetch(
    `${baseUrl.replace(/\/$/, "")}/.netlify/functions/videos-sync-background`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({ source: "scheduled" })
    }
  );

  return json(response.ok ? 200 : 502, {
    ok: response.ok,
    status: response.status
  });
}
