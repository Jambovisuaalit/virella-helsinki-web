import { createHmac, timingSafeEqual } from "node:crypto";
import { cookies } from "next/headers";

const COOKIE_NAME = "virella_admin";
const SESSION_TTL_SECONDS = 60 * 60 * 8;

function secret() {
  return process.env.ADMIN_ACCESS_TOKEN ?? "";
}

function sign(payload: string) {
  return createHmac("sha256", secret()).update(payload).digest("base64url");
}

function tokenFor(payload: string) {
  return `${payload}.${sign(payload)}`;
}

function safeEqual(a: string, b: string) {
  const left = Buffer.from(a);
  const right = Buffer.from(b);
  return left.length === right.length && timingSafeEqual(left, right);
}

export function isAdminTokenConfigured() {
  return secret().length >= 32;
}

export function createAdminSession() {
  if (!isAdminTokenConfigured()) return null;
  const payload = String(Math.floor(Date.now() / 1000));
  return tokenFor(payload);
}

export function isValidAdminSession(value: string | undefined) {
  if (!value || !isAdminTokenConfigured()) return false;
  const separator = value.lastIndexOf(".");
  if (separator <= 0) return false;

  const payload = value.slice(0, separator);
  const signature = value.slice(separator + 1);
  const issuedAt = Number(payload);
  const now = Math.floor(Date.now() / 1000);

  if (!Number.isSafeInteger(issuedAt) || issuedAt > now + 30 || now - issuedAt > SESSION_TTL_SECONDS) {
    return false;
  }

  return safeEqual(signature, sign(payload));
}

export async function isAdminAuthenticated() {
  const cookieStore = await cookies();
  return isValidAdminSession(cookieStore.get(COOKIE_NAME)?.value);
}

export function setAdminSession(response: { cookies: { set: (name: string, value: string, options: Record<string, unknown>) => void } }, session: string) {
  response.cookies.set(COOKIE_NAME, session, {
    httpOnly: true,
    sameSite: "strict",
    secure: true,
    maxAge: SESSION_TTL_SECONDS,
    path: "/",
  });
}

export function clearAdminSession(response: { cookies: { set: (name: string, value: string, options: Record<string, unknown>) => void } }) {
  response.cookies.set(COOKIE_NAME, "", {
    httpOnly: true,
    sameSite: "strict",
    secure: true,
    maxAge: 0,
    path: "/",
  });
}
