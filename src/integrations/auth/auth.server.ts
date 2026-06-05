import Database from "better-sqlite3";
import { createHmac, createHash, randomUUID, timingSafeEqual } from "crypto";
import { getRequest } from "@tanstack/react-start/server";
import path from "path";

const AUTH_DB_PATH = process.env.AUTH_DB_PATH || path.resolve(process.cwd(), "auth.db");
const AUTH_JWT_SECRET = process.env.AUTH_JWT_SECRET || "change-me-to-a-secure-secret";
const TOKEN_EXPIRES_IN_SECONDS = 60 * 60 * 24 * 7;

interface AuthUser {
  id: string;
  email: string;
  telegram_username: string | null;
  created_at: string;
}

interface TokenPayload {
  sub: string;
  email: string;
  iat: number;
  exp: number;
}

let db: Database.Database | undefined;

function getDb() {
  if (db) return db;
  db = new Database(AUTH_DB_PATH);
  db.exec(`
    CREATE TABLE IF NOT EXISTS users (
      id TEXT PRIMARY KEY,
      email TEXT UNIQUE NOT NULL,
      password_hash TEXT NOT NULL,
      telegram_username TEXT,
      created_at TEXT NOT NULL
    );
    CREATE TABLE IF NOT EXISTS subscriptions (
      id TEXT PRIMARY KEY,
      user_id TEXT NOT NULL,
      plan_months INTEGER NOT NULL,
      status TEXT NOT NULL,
      vpn_key TEXT,
      started_at TEXT NOT NULL,
      expires_at TEXT NOT NULL,
      created_at TEXT NOT NULL,
      FOREIGN KEY(user_id) REFERENCES users(id)
    );
    CREATE TABLE IF NOT EXISTS payments (
      id TEXT PRIMARY KEY,
      user_id TEXT NOT NULL,
      subscription_id TEXT NOT NULL,
      amount_rub INTEGER NOT NULL,
      status TEXT NOT NULL,
      provider TEXT NOT NULL,
      created_at TEXT NOT NULL,
      FOREIGN KEY(user_id) REFERENCES users(id),
      FOREIGN KEY(subscription_id) REFERENCES subscriptions(id)
    );
    CREATE TABLE IF NOT EXISTS devices (
      id TEXT PRIMARY KEY,
      user_id TEXT NOT NULL,
      name TEXT NOT NULL,
      platform TEXT NOT NULL,
      last_seen_at TEXT,
      created_at TEXT NOT NULL,
      FOREIGN KEY(user_id) REFERENCES users(id)
    );
  `);
  return db;
}

function base64UrlEncode(value: string | Buffer) {
  return Buffer.from(value)
    .toString("base64")
    .replace(/=/g, "")
    .replace(/\+/g, "-")
    .replace(/\//g, "_");
}

function base64UrlDecode(value: string) {
  const padded = value + "=".repeat((4 - (value.length % 4)) % 4);
  return Buffer.from(padded.replace(/-/g, "+").replace(/_/g, "/"), "base64");
}

function hashPassword(password: string) {
  return createHash("sha256").update(password, "utf8").digest("hex");
}

function signToken(payload: TokenPayload) {
  const header = base64UrlEncode(JSON.stringify({ alg: "HS256", typ: "JWT" }));
  const body = base64UrlEncode(JSON.stringify(payload));
  const signature = base64UrlEncode(
    createHmac("sha256", AUTH_JWT_SECRET)
      .update(`${header}.${body}`)
      .digest(),
  );
  return `${header}.${body}.${signature}`;
}

function verifyToken(token: string) {
  const parts = token.split(".");
  if (parts.length !== 3) {
    throw new Error("Unauthorized: Invalid token format");
  }
  const [header, body, signature] = parts;
  const expected = base64UrlEncode(
    createHmac("sha256", AUTH_JWT_SECRET)
      .update(`${header}.${body}`)
      .digest(),
  );
  const sigBuffer = Buffer.from(signature);
  const expectedBuffer = Buffer.from(expected);
  if (sigBuffer.length !== expectedBuffer.length || !timingSafeEqual(sigBuffer, expectedBuffer)) {
    throw new Error("Unauthorized: Invalid token signature");
  }

  const payload = JSON.parse(base64UrlDecode(body).toString("utf8")) as TokenPayload;

  if (payload.exp < Math.floor(Date.now() / 1000)) {
    throw new Error("Unauthorized: Token expired");
  }
  return payload;
}

function normalizeEmail(email: string) {
  return email.trim().toLowerCase();
}

export function getUserByEmail(email: string) {
  const db = getDb();
  return db
    .prepare("SELECT id, email, telegram_username, created_at FROM users WHERE email = ?")
    .get(normalizeEmail(email)) as AuthUser | undefined;
}

export function getUserById(id: string) {
  const db = getDb();
  return db
    .prepare("SELECT id, email, telegram_username, created_at FROM users WHERE id = ?")
    .get(id) as AuthUser | undefined;
}

export function createUser(email: string, password: string) {
  const db = getDb();
  const id = randomUUID();
  const normalizedEmail = normalizeEmail(email);
  const created_at = new Date().toISOString();
  const password_hash = hashPassword(password);
  db.prepare(
    "INSERT INTO users (id, email, password_hash, telegram_username, created_at) VALUES (?, ?, ?, NULL, ?)",
  ).run(id, normalizedEmail, password_hash, created_at);

  return { id, email: normalizedEmail, telegram_username: null, created_at };
}

export function verifyUserPassword(email: string, password: string) {
  const db = getDb();
  const normalizedEmail = normalizeEmail(email);
  const record = db
    .prepare("SELECT id, password_hash FROM users WHERE email = ?")
    .get(normalizedEmail) as { id: string; password_hash: string } | undefined;
  if (!record) return null;
  const password_hash = hashPassword(password);
  if (password_hash !== record.password_hash) return null;
  return getUserById(record.id) ?? null;
}

export function signInOrRegister(email: string, password: string) {
  const existingUser = getUserByEmail(email);
  if (existingUser) {
    const valid = verifyUserPassword(email, password);
    if (!valid) {
      throw new Error("Неверный email или пароль");
    }
    const token = signToken({
      sub: valid.id,
      email: valid.email,
      iat: Math.floor(Date.now() / 1000),
      exp: Math.floor(Date.now() / 1000) + TOKEN_EXPIRES_IN_SECONDS,
    });
    return { user: valid, token };
  }

  const user = createUser(email, password);
  const token = signToken({
    sub: user.id,
    email: user.email,
    iat: Math.floor(Date.now() / 1000),
    exp: Math.floor(Date.now() / 1000) + TOKEN_EXPIRES_IN_SECONDS,
  });
  return { user, token };
}

export function updateTelegramUsername(userId: string, telegramUsername: string | null) {
  const db = getDb();
  db.prepare("UPDATE users SET telegram_username = ? WHERE id = ?").run(
    telegramUsername,
    userId,
  );
}

export type SubscriptionRecord = {
  id: string;
  user_id: string;
  plan_months: number;
  status: string;
  vpn_key: string | null;
  started_at: string;
  expires_at: string;
  created_at: string;
};

export type PaymentRecord = {
  id: string;
  user_id: string;
  subscription_id: string;
  amount_rub: number;
  status: string;
  provider: string;
  created_at: string;
};

export type DeviceRecord = {
  id: string;
  user_id: string;
  name: string;
  platform: string;
  last_seen_at: string | null;
  created_at: string;
};

export function createSubscription(
  userId: string,
  planMonths: number,
  vpnKey: string,
  startedAt: string,
  expiresAt: string,
  amountRub: number,
) {
  const db = getDb();
  const subscriptionId = randomUUID();
  const createdAt = new Date().toISOString();

  db.prepare(
    "INSERT INTO subscriptions (id, user_id, plan_months, status, vpn_key, started_at, expires_at, created_at) VALUES (?, ?, ?, ?, ?, ?, ?, ?)",
  ).run(subscriptionId, userId, planMonths, "active", vpnKey, startedAt, expiresAt, createdAt);

  db.prepare(
    "INSERT INTO payments (id, user_id, subscription_id, amount_rub, status, provider, created_at) VALUES (?, ?, ?, ?, ?, ?, ?)",
  ).run(randomUUID(), userId, subscriptionId, amountRub, "succeeded", "test", createdAt);

  return db
    .prepare(
      "SELECT id, user_id, plan_months, status, vpn_key, started_at, expires_at, created_at FROM subscriptions WHERE id = ?",
    )
    .get(subscriptionId) as SubscriptionRecord;
}

export function getLatestSubscription(userId: string) {
  const db = getDb();
  return db
    .prepare(
      "SELECT id, user_id, plan_months, status, vpn_key, started_at, expires_at, created_at FROM subscriptions WHERE user_id = ? ORDER BY created_at DESC LIMIT 1",
    )
    .get(userId) as SubscriptionRecord | undefined;
}

export function getPaymentsByUser(userId: string) {
  const db = getDb();
  return db
    .prepare(
      "SELECT id, user_id, subscription_id, amount_rub, status, provider, created_at FROM payments WHERE user_id = ? ORDER BY created_at DESC",
    )
    .all(userId) as PaymentRecord[];
}

export function getDevicesByUser(userId: string) {
  const db = getDb();
  return db
    .prepare(
      "SELECT id, user_id, name, platform, last_seen_at, created_at FROM devices WHERE user_id = ? ORDER BY created_at DESC",
    )
    .all(userId) as DeviceRecord[];
}

export function addDeviceForUser(userId: string, name: string, platform: string) {
  const db = getDb();
  const id = randomUUID();
  const createdAt = new Date().toISOString();
  const lastSeenAt = new Date().toISOString();

  db.prepare(
    "INSERT INTO devices (id, user_id, name, platform, last_seen_at, created_at) VALUES (?, ?, ?, ?, ?, ?)",
  ).run(id, userId, name, platform, lastSeenAt, createdAt);

  return db
    .prepare("SELECT id, user_id, name, platform, last_seen_at, created_at FROM devices WHERE id = ?")
    .get(id) as DeviceRecord;
}

export function removeDeviceForUser(userId: string, id: string) {
  const db = getDb();
  db.prepare("DELETE FROM devices WHERE id = ? AND user_id = ?").run(id, userId);
}

export function getBearerToken() {
  const request = getRequest();
  const header = request?.headers.get("authorization");
  if (!header?.startsWith("Bearer ")) return null;
  return header.replace("Bearer ", "");
}

export function getUserFromRequest() {
  const token = getBearerToken();
  if (!token) return null;
  try {
    const payload = verifyToken(token);
    return getUserById(payload.sub) ?? null;
  } catch {
    return null;
  }
}

export function requireAuthenticatedUser() {
  const user = getUserFromRequest();
  if (!user) {
    throw new Error("Unauthorized");
  }
  return user;
}
