import { createHmac, timingSafeEqual } from "node:crypto";
import type { VercelRequest, VercelResponse } from "@vercel/node";
import { requiredEnv, sendJson } from "./http.js";

const cookieName = "goch_admin_session";
const maxAgeSeconds = 60 * 60 * 24 * 7;

export function createSessionCookie() {
  const issuedAt = Date.now().toString();
  const signature = sign(issuedAt);

  return [
    `${cookieName}=${issuedAt}.${signature}`,
    "Path=/",
    "HttpOnly",
    "SameSite=Lax",
    secureCookiePart(),
    `Max-Age=${maxAgeSeconds}`,
  ]
    .filter(Boolean)
    .join("; ");
}

export function clearSessionCookie() {
  return [
    `${cookieName}=`,
    "Path=/",
    "HttpOnly",
    "SameSite=Lax",
    secureCookiePart(),
    "Max-Age=0",
  ]
    .filter(Boolean)
    .join("; ");
}

export function isAuthenticated(request: VercelRequest) {
  const cookieHeader = request.headers.cookie ?? "";
  const cookies = Object.fromEntries(
    cookieHeader
      .split(";")
      .map((cookie) => cookie.trim().split("="))
      .filter(([name, value]) => name && value),
  );
  const value = cookies[cookieName];

  if (!value) {
    return false;
  }

  const [issuedAt, signature] = value.split(".");
  if (!issuedAt || !signature || sign(issuedAt) !== signature) {
    return false;
  }

  const age = Date.now() - Number(issuedAt);
  return Number.isFinite(age) && age >= 0 && age <= maxAgeSeconds * 1000;
}

export function requireAdmin(
  request: VercelRequest,
  response: VercelResponse,
) {
  if (isAuthenticated(request)) {
    return true;
  }

  sendJson(response, 401, { error: "Unauthorized" });
  return false;
}

export function isValidAdminToken(token: unknown) {
  if (typeof token !== "string") {
    return false;
  }

  const expected = requiredEnv("ADMIN_TOKEN");
  const actualBuffer = Buffer.from(token);
  const expectedBuffer = Buffer.from(expected);

  return (
    actualBuffer.length === expectedBuffer.length &&
    timingSafeEqual(actualBuffer, expectedBuffer)
  );
}

function sign(value: string) {
  return createHmac("sha256", requiredEnv("SESSION_SECRET"))
    .update(value)
    .digest("hex");
}

function secureCookiePart() {
  return process.env.VERCEL ? "Secure" : "";
}
