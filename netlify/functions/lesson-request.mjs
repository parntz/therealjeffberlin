const RESEND_API_URL = "https://api.resend.com/emails";

function json(statusCode, body) {
  return {
    statusCode,
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify(body)
  };
}

function escapeHtml(value) {
  return String(value)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#39;");
}

export async function handler(event) {
  if (event.httpMethod !== "POST") {
    return json(405, { error: "Method not allowed." });
  }

  let payload;

  try {
    payload = JSON.parse(event.body || "{}");
  } catch {
    return json(400, { error: "Invalid request body." });
  }

  const {
    name = "",
    email = "",
    phone = "",
    bassLevel = "",
    goals = "",
    date = "",
    slot = "",
    website = ""
  } = payload;

  if (website) {
    return json(200, { ok: true });
  }

  if (!name || !email || !phone || !bassLevel || !goals || !date || !slot) {
    return json(400, { error: "Missing required fields." });
  }

  const apiKey = process.env.RESEND_API_KEY;
  const from = process.env.LESSON_REQUEST_FROM;
  const to = process.env.LESSON_REQUEST_TO || "jeffberlinbasslessons@yahoo.com";

  if (!apiKey || !from || !to) {
    return json(503, {
      error: "Email delivery is not configured yet."
    });
  }

  const safeName = escapeHtml(name);
  const safeEmail = escapeHtml(email);
  const safePhone = escapeHtml(phone);
  const safeBassLevel = escapeHtml(bassLevel);
  const safeGoals = escapeHtml(goals).replaceAll("\n", "<br />");
  const safeDate = escapeHtml(date);
  const safeSlot = escapeHtml(slot);

  const response = await fetch(RESEND_API_URL, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${apiKey}`,
      "Content-Type": "application/json"
    },
    body: JSON.stringify({
      from,
      to: [to],
      reply_to: email,
      subject: `New Jeff Berlin lesson request from ${name}`,
      text: [
        "New lesson request",
        "",
        `Name: ${name}`,
        `Email: ${email}`,
        `Phone: ${phone}`,
        `Current level: ${bassLevel}`,
        `Requested date: ${date}`,
        `Requested slot: ${slot}`,
        "",
        "What the student wants to work on:",
        goals
      ].join("\n"),
      html: `
        <div style="font-family: Arial, sans-serif; line-height: 1.6; color: #111;">
          <h2 style="margin-bottom: 16px;">New Jeff Berlin lesson request</h2>
          <p><strong>Name:</strong> ${safeName}</p>
          <p><strong>Email:</strong> ${safeEmail}</p>
          <p><strong>Phone:</strong> ${safePhone}</p>
          <p><strong>Current level:</strong> ${safeBassLevel}</p>
          <p><strong>Requested date:</strong> ${safeDate}</p>
          <p><strong>Requested slot:</strong> ${safeSlot}</p>
          <p><strong>What the student wants to work on:</strong><br />${safeGoals}</p>
        </div>
      `
    })
  });

  if (!response.ok) {
    const detail = await response.text();
    return json(502, {
      error: "Unable to send the lesson request email.",
      detail
    });
  }

  return json(200, { ok: true });
}
