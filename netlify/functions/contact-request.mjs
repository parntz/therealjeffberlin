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
    subject = "",
    message = "",
    website = ""
  } = payload;

  if (website) {
    return json(200, { ok: true });
  }

  if (!name || !email || !subject || !message) {
    return json(400, { error: "Missing required fields." });
  }

  const apiKey = process.env.RESEND_API_KEY;
  const from = process.env.CONTACT_REQUEST_FROM || process.env.LESSON_REQUEST_FROM;
  const to = process.env.CONTACT_REQUEST_TO || "actualjeffberlin@gmail.com";

  if (!apiKey || !from || !to) {
    return json(503, {
      error: "Email delivery is not configured yet."
    });
  }

  const safeName = escapeHtml(name);
  const safeEmail = escapeHtml(email);
  const safeSubject = escapeHtml(subject);
  const safeMessage = escapeHtml(message).replaceAll("\n", "<br />");

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
      subject: `New Jeff Berlin contact message: ${subject}`,
      text: [
        "New contact message",
        "",
        `Name: ${name}`,
        `Email: ${email}`,
        `Subject: ${subject}`,
        "",
        message
      ].join("\n"),
      html: `
        <div style="font-family: Arial, sans-serif; line-height: 1.6; color: #111;">
          <h2 style="margin-bottom: 16px;">New Jeff Berlin contact message</h2>
          <p><strong>Name:</strong> ${safeName}</p>
          <p><strong>Email:</strong> ${safeEmail}</p>
          <p><strong>Subject:</strong> ${safeSubject}</p>
          <p><strong>Message:</strong><br />${safeMessage}</p>
        </div>
      `
    })
  });

  if (!response.ok) {
    const detail = await response.text();
    return json(502, {
      error: "Unable to send the contact email.",
      detail
    });
  }

  return json(200, { ok: true });
}
