import { createHmac, timingSafeEqual } from "node:crypto";

export const ADMIN_SESSION_COOKIE = "jb_admin_session";
const SESSION_MAX_AGE = 60 * 60 * 24 * 7;

function getAdminEmail() {
  return process.env.ADMIN_EMAIL || "";
}

function getAdminPassword() {
  return process.env.ADMIN_PASSWORD || "";
}

function getSessionSecret() {
  return (
    process.env.ADMIN_SESSION_SECRET ||
    process.env.ADMIN_PASSWORD ||
    "jeff-berlin-admin-secret"
  );
}

function safeEqual(a, b) {
  const aBuffer = Buffer.from(a);
  const bBuffer = Buffer.from(b);

  if (aBuffer.length !== bBuffer.length) {
    return false;
  }

  return timingSafeEqual(aBuffer, bBuffer);
}

function sign(value) {
  return createHmac("sha256", getSessionSecret()).update(value).digest("hex");
}

export function verifyAdminCredentials(email, password) {
  const adminEmail = getAdminEmail();
  const adminPassword = getAdminPassword();

  if (!adminEmail || !adminPassword) {
    return false;
  }

  return safeEqual(email, adminEmail) && safeEqual(password, adminPassword);
}

export function createAdminSessionValue(email) {
  const payload = `${email}|${Date.now()}`;
  return `${payload}|${sign(payload)}`;
}

export function readAdminSession(value) {
  if (!value) {
    return null;
  }

  const parts = value.split("|");

  if (parts.length !== 3) {
    return null;
  }

  const [email, issuedAt, signature] = parts;
  const payload = `${email}|${issuedAt}`;

  if (!safeEqual(signature, sign(payload))) {
    return null;
  }

  if (!safeEqual(email, getAdminEmail())) {
    return null;
  }

  return {
    email,
    issuedAt: Number(issuedAt)
  };
}

export function getAdminSessionCookie() {
  return {
    name: ADMIN_SESSION_COOKIE,
    options: {
      httpOnly: true,
      sameSite: "lax",
      secure: process.env.NODE_ENV === "production",
      path: "/",
      maxAge: SESSION_MAX_AGE
    }
  };
}
