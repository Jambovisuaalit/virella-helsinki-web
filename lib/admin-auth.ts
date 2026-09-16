import { createHmac, timingSafeEqual } from "node:crypto";
import { cookies } from "next/headers";

const COOKIE_NAME = "virella_admin";
const SESSION_TTL_SECONDS = 60 * 60 * 8;

function username() {
  return process.env.ADMIN_USERNAME ?? "";
}

function password() {
  return process.env.ADMIN_PASSWORD ?? "";
}

function sessionSecret() {
  return process.env.ADMIN_SESSION_SECRET || password();
}

function safeEqual(a: string, b: string) {
  const left = Buffer.from(a);
  const right = Buffer.from(b);
  return left.length === right.length && timingSafeEqual(left, right);
}

function sign(payload: string) {
  return createHmac("sha256", sessionSecret()).update(payload).digest("base64url");
}

export function isAdminCredentialsConfigured() {
  return username().length > 0 && password().length >= 12 && sessionSecret().length >= 12;
}

export function verifyAdminCredentials(suppliedUsername: string, suppliedPassword: string) {
  if (!isAdminCredentialsConfigured()) return false;
  return safeEqual(suppliedUsername, username()) && safeEqual(suppliedPassword, password());
}

export function createAdminSession() {
  if (!isAdminCredentialsConfigured()) return null;
  const payload = String(Math.floor(Date.now() / 1000));
  return `${payload}.${sign(payload)}`;
}

export function isValidAdminSession(value: string | undefined) {
  if (!value || !isAdminCredentialsConfigured()) return false;
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
