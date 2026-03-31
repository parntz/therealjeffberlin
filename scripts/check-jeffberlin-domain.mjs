const DEFAULT_URL = "http://therealjeffberlin.com";
const DEFAULT_INTERVAL_MS = 5_000;

function parseArgs(argv) {
  const options = {
    url: DEFAULT_URL,
    intervalMs: DEFAULT_INTERVAL_MS
  };

  for (let index = 0; index < argv.length; index += 1) {
    const token = argv[index];

    if (token === "--url" && argv[index + 1]) {
      options.url = argv[index + 1];
      index += 1;
      continue;
    }

    if (token === "--interval" && argv[index + 1]) {
      const seconds = Number(argv[index + 1]);

      if (Number.isFinite(seconds) && seconds > 0) {
        options.intervalMs = Math.max(15_000, Math.round(seconds * 1000));
      }

      index += 1;
    }
  }

  return options;
}

function detectPageState(html) {
  const normalized = html.toLowerCase();
  const wixMarkers = [
    "wix",
    "wixsite",
    "wixstatic",
    "create your website with wix",
    "this site was designed with the"
  ];
  const jeffMarkers = [
    "jeff berlin",
    "electric bass",
    "book a lesson",
    "shop the books",
    "/music",
    "/lessons"
  ];

  const wixHits = wixMarkers.filter((marker) => normalized.includes(marker));
  const jeffHits = jeffMarkers.filter((marker) => normalized.includes(marker));

  if (jeffHits.length >= 2 && wixHits.length === 0) {
    return {
      status: "jeff",
      summary: `Jeff Berlin markers: ${jeffHits.join(", ")}`
    };
  }

  if (wixHits.length > 0) {
    return {
      status: "wix",
      summary: `Wix markers: ${wixHits.join(", ")}`
    };
  }

  if (jeffHits.length >= 2) {
    return {
      status: "jeff",
      summary: `Jeff Berlin markers: ${jeffHits.join(", ")}`
    };
  }

  return {
    status: "unknown",
    summary: "No clear Wix or Jeff Berlin markers"
  };
}

async function checkOnce(url) {
  const response = await fetch(url, {
    redirect: "follow",
    headers: {
      "user-agent": "therealjeffberlin-domain-checker/1.0"
    }
  });

  const html = await response.text();
  const pageState = detectPageState(html);

  return {
    ok: response.ok,
    statusCode: response.status,
    finalUrl: response.url,
    ...pageState
  };
}

function wait(ms) {
  return new Promise((resolve) => {
    setTimeout(resolve, ms);
  });
}

async function main() {
  const { url, intervalMs } = parseArgs(process.argv.slice(2));

  console.log(`Watching ${url}`);
  console.log(`Polling every ${Math.round(intervalMs / 1000)} seconds`);

  for (;;) {
    const startedAt = new Date();

    try {
      const result = await checkOnce(url);
      const prefix = `[${startedAt.toISOString()}] ${result.statusCode} ${result.finalUrl}`;

      if (result.status === "jeff") {
        console.log(`${prefix} -> Jeff Berlin site detected. ${result.summary}`);
        process.exit(0);
      }

      console.log(`${prefix} -> ${result.status}. ${result.summary}`);
    } catch (error) {
      const message = error instanceof Error ? error.message : "Unknown error";
      console.log(`[${startedAt.toISOString()}] request failed -> ${message}`);
    }

    await wait(intervalMs);
  }
}

main();
