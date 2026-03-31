import { createHmac, timingSafeEqual } from "node:crypto";

export const ADMIN_SESSION_COOKIE = "jb_admin_session";
const SESSION_MAX_AGE = 60 * 60 * 24 * 7;
const LOCAL_DEV_ADMIN_EMAIL = "__local_admin__";

function getAdminEmail() {
  return (process.env.ADMIN_EMAIL || "").trim();
}

function getAdminPassword() {
  return (process.env.ADMIN_PASSWORD || "").trim();
}

function isAdminConfigured() {
  return Boolean(getAdminEmail() && getAdminPassword());
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
  const normalizedEmail = String(email || "").trim();
  const normalizedPassword = String(password || "").trim();
  const adminEmail = getAdminEmail();
  const adminPassword = getAdminPassword();

  if (!isAdminConfigured()) {
    return false;
  }

  if (!normalizedEmail || !normalizedPassword) {
    return false;
  }

  return safeEqual(normalizedEmail, adminEmail) && safeEqual(normalizedPassword, adminPassword);
}

export function createAdminSessionValue(email) {
  const payload = `${String(email || "").trim()}|${Date.now()}`;
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

  if (
    email === LOCAL_DEV_ADMIN_EMAIL &&
    process.env.NODE_ENV !== "production"
  ) {
    return {
      email,
      issuedAt: Number(issuedAt)
    };
  }

  if (!isAdminConfigured()) {
    return null;
  }

  if (!email || !safeEqual(email, getAdminEmail())) {
    return null;
  }

  return {
    email,
    issuedAt: Number(issuedAt)
  };
}

export function getLocalDevAdminEmail() {
  return LOCAL_DEV_ADMIN_EMAIL;
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
