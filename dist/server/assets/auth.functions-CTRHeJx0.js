import { T as TSS_SERVER_FUNCTION, b as getRequest, c as createServerFn } from "./server-0JC-SxFr.js";
import { z } from "zod";
import Database from "better-sqlite3";
import { randomUUID, createHmac, timingSafeEqual, createHash } from "crypto";
import path from "path";
import "node:async_hooks";
import "h3-v2";
import "@tanstack/router-core";
import "seroval";
import "@tanstack/history";
import "@tanstack/router-core/ssr/client";
import "@tanstack/router-core/ssr/server";
import "react";
import "@tanstack/react-router";
import "react/jsx-runtime";
import "@tanstack/react-router/ssr/server";
var createServerRpc = (serverFnMeta, splitImportFn) => {
  const url = "/_serverFn/" + serverFnMeta.id;
  return Object.assign(splitImportFn, {
    url,
    serverFnMeta,
    [TSS_SERVER_FUNCTION]: true
  });
};
const AUTH_DB_PATH = process.env.AUTH_DB_PATH || path.resolve(process.cwd(), "auth.db");
const AUTH_JWT_SECRET = process.env.AUTH_JWT_SECRET || "change-me-to-a-secure-secret";
const TOKEN_EXPIRES_IN_SECONDS = 60 * 60 * 24 * 7;
let db;
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
function base64UrlEncode(value) {
  return Buffer.from(value).toString("base64").replace(/=/g, "").replace(/\+/g, "-").replace(/\//g, "_");
}
function base64UrlDecode(value) {
  const padded = value + "=".repeat((4 - value.length % 4) % 4);
  return Buffer.from(padded.replace(/-/g, "+").replace(/_/g, "/"), "base64");
}
function hashPassword(password) {
  return createHash("sha256").update(password, "utf8").digest("hex");
}
function signToken(payload) {
  const header = base64UrlEncode(JSON.stringify({ alg: "HS256", typ: "JWT" }));
  const body = base64UrlEncode(JSON.stringify(payload));
  const signature = base64UrlEncode(
    createHmac("sha256", AUTH_JWT_SECRET).update(`${header}.${body}`).digest()
  );
  return `${header}.${body}.${signature}`;
}
function verifyToken(token) {
  const parts = token.split(".");
  if (parts.length !== 3) {
    throw new Error("Unauthorized: Invalid token format");
  }
  const [header, body, signature] = parts;
  const expected = base64UrlEncode(
    createHmac("sha256", AUTH_JWT_SECRET).update(`${header}.${body}`).digest()
  );
  const sigBuffer = Buffer.from(signature);
  const expectedBuffer = Buffer.from(expected);
  if (sigBuffer.length !== expectedBuffer.length || !timingSafeEqual(sigBuffer, expectedBuffer)) {
    throw new Error("Unauthorized: Invalid token signature");
  }
  const payload = JSON.parse(base64UrlDecode(body).toString("utf8"));
  if (payload.exp < Math.floor(Date.now() / 1e3)) {
    throw new Error("Unauthorized: Token expired");
  }
  return payload;
}
function normalizeEmail(email) {
  return email.trim().toLowerCase();
}
function getUserByEmail(email) {
  const db2 = getDb();
  return db2.prepare("SELECT id, email, telegram_username, created_at FROM users WHERE email = ?").get(normalizeEmail(email));
}
function getUserById(id) {
  const db2 = getDb();
  return db2.prepare("SELECT id, email, telegram_username, created_at FROM users WHERE id = ?").get(id);
}
function createUser(email, password) {
  const db2 = getDb();
  const id = randomUUID();
  const normalizedEmail = normalizeEmail(email);
  const created_at = (/* @__PURE__ */ new Date()).toISOString();
  const password_hash = hashPassword(password);
  db2.prepare(
    "INSERT INTO users (id, email, password_hash, telegram_username, created_at) VALUES (?, ?, ?, NULL, ?)"
  ).run(id, normalizedEmail, password_hash, created_at);
  return { id, email: normalizedEmail, telegram_username: null, created_at };
}
function verifyUserPassword(email, password) {
  const db2 = getDb();
  const normalizedEmail = normalizeEmail(email);
  const record = db2.prepare("SELECT id, password_hash FROM users WHERE email = ?").get(normalizedEmail);
  if (!record) return null;
  const password_hash = hashPassword(password);
  if (password_hash !== record.password_hash) return null;
  return getUserById(record.id) ?? null;
}
function signInOrRegister(email, password) {
  const existingUser = getUserByEmail(email);
  if (existingUser) {
    const valid = verifyUserPassword(email, password);
    if (!valid) {
      throw new Error("Неверный email или пароль");
    }
    const token2 = signToken({
      sub: valid.id,
      email: valid.email,
      iat: Math.floor(Date.now() / 1e3),
      exp: Math.floor(Date.now() / 1e3) + TOKEN_EXPIRES_IN_SECONDS
    });
    return { user: valid, token: token2 };
  }
  const user = createUser(email, password);
  const token = signToken({
    sub: user.id,
    email: user.email,
    iat: Math.floor(Date.now() / 1e3),
    exp: Math.floor(Date.now() / 1e3) + TOKEN_EXPIRES_IN_SECONDS
  });
  return { user, token };
}
function updateTelegramUsername(userId, telegramUsername) {
  const db2 = getDb();
  db2.prepare("UPDATE users SET telegram_username = ? WHERE id = ?").run(
    telegramUsername,
    userId
  );
}
function createSubscription(userId, planMonths, vpnKey, startedAt, expiresAt, amountRub) {
  const db2 = getDb();
  const subscriptionId = randomUUID();
  const createdAt = (/* @__PURE__ */ new Date()).toISOString();
  db2.prepare(
    "INSERT INTO subscriptions (id, user_id, plan_months, status, vpn_key, started_at, expires_at, created_at) VALUES (?, ?, ?, ?, ?, ?, ?, ?)"
  ).run(subscriptionId, userId, planMonths, "active", vpnKey, startedAt, expiresAt, createdAt);
  db2.prepare(
    "INSERT INTO payments (id, user_id, subscription_id, amount_rub, status, provider, created_at) VALUES (?, ?, ?, ?, ?, ?, ?)"
  ).run(randomUUID(), userId, subscriptionId, amountRub, "succeeded", "test", createdAt);
  return db2.prepare(
    "SELECT id, user_id, plan_months, status, vpn_key, started_at, expires_at, created_at FROM subscriptions WHERE id = ?"
  ).get(subscriptionId);
}
function getLatestSubscription(userId) {
  const db2 = getDb();
  return db2.prepare(
    "SELECT id, user_id, plan_months, status, vpn_key, started_at, expires_at, created_at FROM subscriptions WHERE user_id = ? ORDER BY created_at DESC LIMIT 1"
  ).get(userId);
}
function getPaymentsByUser(userId) {
  const db2 = getDb();
  return db2.prepare(
    "SELECT id, user_id, subscription_id, amount_rub, status, provider, created_at FROM payments WHERE user_id = ? ORDER BY created_at DESC"
  ).all(userId);
}
function getDevicesByUser(userId) {
  const db2 = getDb();
  return db2.prepare(
    "SELECT id, user_id, name, platform, last_seen_at, created_at FROM devices WHERE user_id = ? ORDER BY created_at DESC"
  ).all(userId);
}
function addDeviceForUser(userId, name, platform) {
  const db2 = getDb();
  const id = randomUUID();
  const createdAt = (/* @__PURE__ */ new Date()).toISOString();
  const lastSeenAt = (/* @__PURE__ */ new Date()).toISOString();
  db2.prepare(
    "INSERT INTO devices (id, user_id, name, platform, last_seen_at, created_at) VALUES (?, ?, ?, ?, ?, ?)"
  ).run(id, userId, name, platform, lastSeenAt, createdAt);
  return db2.prepare("SELECT id, user_id, name, platform, last_seen_at, created_at FROM devices WHERE id = ?").get(id);
}
function getBearerToken() {
  const request = getRequest();
  const header = request?.headers.get("authorization");
  if (!header?.startsWith("Bearer ")) return null;
  return header.replace("Bearer ", "");
}
function getUserFromRequest() {
  const token = getBearerToken();
  if (!token) return null;
  try {
    const payload = verifyToken(token);
    return getUserById(payload.sub) ?? null;
  } catch {
    return null;
  }
}
function requireAuthenticatedUser() {
  const user = getUserFromRequest();
  if (!user) {
    throw new Error("Unauthorized");
  }
  return user;
}
const login_createServerFn_handler = createServerRpc({
  id: "958e038a2d6f477fc04eb8dc9d6e74334419d2f284b951eca977b55a109e6f17",
  name: "login",
  filename: "src/lib/api/auth.functions.ts"
}, (opts) => login.__executeServer(opts));
const login = createServerFn({
  method: "POST"
}).inputValidator(z.object({
  email: z.string().email(),
  password: z.string().min(4)
})).handler(login_createServerFn_handler, async ({
  data
}) => {
  const {
    user,
    token
  } = signInOrRegister(data.email, data.password);
  return {
    user,
    token
  };
});
const getUserSession_createServerFn_handler = createServerRpc({
  id: "d92fa43bbec247ecfb863954a5b34e07709e699aba9561587b24cb100141b832",
  name: "getUserSession",
  filename: "src/lib/api/auth.functions.ts"
}, (opts) => getUserSession.__executeServer(opts));
const getUserSession = createServerFn({
  method: "POST"
}).handler(getUserSession_createServerFn_handler, async () => {
  const user = getUserFromRequest();
  return {
    user
  };
});
const updateTelegram_createServerFn_handler = createServerRpc({
  id: "74da8b126c29b6fe84c0326fcb42633af810033f533e751d8ca23d58e528e62e",
  name: "updateTelegram",
  filename: "src/lib/api/auth.functions.ts"
}, (opts) => updateTelegram.__executeServer(opts));
const updateTelegram = createServerFn({
  method: "POST"
}).inputValidator(z.object({
  telegramUsername: z.string().trim().optional()
})).handler(updateTelegram_createServerFn_handler, async ({
  data
}) => {
  const user = requireAuthenticatedUser();
  updateTelegramUsername(user.id, data.telegramUsername ?? null);
  return {
    user: getUserFromRequest()
  };
});
const createSubscriptionForUser_createServerFn_handler = createServerRpc({
  id: "b3f18c9e5613d09c1260d4b6f7e1e04b0c7814d4335dac6d61dd76120fde46aa",
  name: "createSubscriptionForUser",
  filename: "src/lib/api/auth.functions.ts"
}, (opts) => createSubscriptionForUser.__executeServer(opts));
const createSubscriptionForUser = createServerFn({
  method: "POST"
}).inputValidator(z.object({
  planMonths: z.number().int().positive(),
  vpnKey: z.string().min(1),
  startedAt: z.string(),
  expiresAt: z.string(),
  amountRub: z.number().int().nonnegative()
})).handler(createSubscriptionForUser_createServerFn_handler, async ({
  data
}) => {
  const user = requireAuthenticatedUser();
  const subscription = createSubscription(user.id, data.planMonths, data.vpnKey, data.startedAt, data.expiresAt, data.amountRub);
  return {
    subscription
  };
});
const getLatestSubscriptionForUser_createServerFn_handler = createServerRpc({
  id: "ccbc9d0d2f895e51838758711c9a033ff6475debb52cdeb2e2de9a08c5276d3d",
  name: "getLatestSubscriptionForUser",
  filename: "src/lib/api/auth.functions.ts"
}, (opts) => getLatestSubscriptionForUser.__executeServer(opts));
const getLatestSubscriptionForUser = createServerFn({
  method: "POST"
}).handler(getLatestSubscriptionForUser_createServerFn_handler, async () => {
  const user = requireAuthenticatedUser();
  return {
    subscription: getLatestSubscription(user.id) ?? null
  };
});
const getPaymentsForUser_createServerFn_handler = createServerRpc({
  id: "40840fb9a02541f6ea9436e1a6a32d471ef3b9c157684a78c540d2a238c3440e",
  name: "getPaymentsForUser",
  filename: "src/lib/api/auth.functions.ts"
}, (opts) => getPaymentsForUser.__executeServer(opts));
const getPaymentsForUser = createServerFn({
  method: "POST"
}).handler(getPaymentsForUser_createServerFn_handler, async () => {
  const user = requireAuthenticatedUser();
  return {
    payments: getPaymentsByUser(user.id)
  };
});
const getDevicesForUser_createServerFn_handler = createServerRpc({
  id: "017232d6b07b332cf47198212a3708ae83968c96004fdf3ead93bbfaac003041",
  name: "getDevicesForUser",
  filename: "src/lib/api/auth.functions.ts"
}, (opts) => getDevicesForUser.__executeServer(opts));
const getDevicesForUser = createServerFn({
  method: "POST"
}).handler(getDevicesForUser_createServerFn_handler, async () => {
  const user = requireAuthenticatedUser();
  return {
    devices: getDevicesByUser(user.id)
  };
});
const addDevice_createServerFn_handler = createServerRpc({
  id: "093c41180bc356b2e35e50742b826e37d745321915902ed9d1d7375198a69b66",
  name: "addDevice",
  filename: "src/lib/api/auth.functions.ts"
}, (opts) => addDevice.__executeServer(opts));
const addDevice = createServerFn({
  method: "POST"
}).inputValidator(z.object({
  name: z.string().min(1),
  platform: z.string().min(1)
})).handler(addDevice_createServerFn_handler, async ({
  data
}) => {
  const user = requireAuthenticatedUser();
  const device = addDeviceForUser(user.id, data.name, data.platform);
  return {
    device
  };
});
const removeDevice_createServerFn_handler = createServerRpc({
  id: "2164b8b07841e45bf57726f46b824a756c27ab4a6d81783275c19da66d8ac654",
  name: "removeDevice",
  filename: "src/lib/api/auth.functions.ts"
}, (opts) => removeDevice.__executeServer(opts));
const removeDevice = createServerFn({
  method: "POST"
}).inputValidator(z.object({
  id: z.string().min(1)
})).handler(removeDevice_createServerFn_handler, async ({
  data
}) => {
  const user = requireAuthenticatedUser();
  removeDeviceForUser(user.id, data.id);
  return {
    success: true
  };
});
export {
  addDevice_createServerFn_handler,
  createSubscriptionForUser_createServerFn_handler,
  getDevicesForUser_createServerFn_handler,
  getLatestSubscriptionForUser_createServerFn_handler,
  getPaymentsForUser_createServerFn_handler,
  getUserSession_createServerFn_handler,
  login_createServerFn_handler,
  removeDevice_createServerFn_handler,
  updateTelegram_createServerFn_handler
};
