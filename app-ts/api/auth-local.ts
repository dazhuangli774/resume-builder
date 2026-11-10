import { Hono } from "hono";
import { setCookie } from "hono/cookie";
import { randomBytes, scryptSync, timingSafeEqual } from "node:crypto";
import { eq, or } from "drizzle-orm";
import { getDb } from "./queries/connection";
import { users } from "@db/schema";
import { env } from "./lib/env";
import { signSessionToken } from "./kimi/session";
import { getSessionCookieOptions } from "./lib/cookies";
import { Session } from "@contracts/constants";

/**
 * 本地用户名 + 口令登录（替代 Kimi OAuth，便于本地/离线演示）。
 *
 * 口令用 scrypt 加盐哈希后存 users.password；unionId 记为 local:<username>，
 * 与 Kimi 登录建的用户互不冲突。签发同一套会话 cookie（kimi_sid），
 * 因此 /api/trpc/* 的鉴权链路完全复用，无需改动。
 */

function hashPassword(password: string): string {
  const salt = randomBytes(16).toString("hex");
  const hash = scryptSync(password, salt, 64).toString("hex");
  return `${salt}:${hash}`;
}

function verifyPassword(password: string, stored: string): boolean {
  const [salt, hash] = (stored || "").split(":");
  if (!salt || !hash) return false;
  const candidate = scryptSync(password, salt, 64);
  const expected = Buffer.from(hash, "hex");
  return candidate.length === expected.length && timingSafeEqual(candidate, expected);
}

function toPublicUser(user: typeof users.$inferSelect) {
  return {
    id: user.id,
    username: user.name ?? "",
    name: user.name ?? "",
    email: user.email ?? "",
    role: user.role,
  };
}

async function issueSession(c: any, user: typeof users.$inferSelect) {
  const token = await signSessionToken({
    unionId: user.unionId,
    clientId: env.appId,
  } as any);
  const opts = getSessionCookieOptions(c.req.raw.headers);
  setCookie(c, Session.cookieName, token, {
    ...opts,
    maxAge: Math.floor(Session.maxAgeMs / 1000),
  });
  return token;
}

export const authLocal = new Hono();

// 登录
authLocal.post("/login", async (c) => {
  const body = await c.req.json().catch(() => ({}) as any);
  const username = String(body.username ?? "").trim();
  const password = String(body.password ?? "");

  if (!username || !password) {
    return c.json({ message: "用户名和密码不能为空" }, 400);
  }

  const rows = await getDb()
    .select()
    .from(users)
    .where(or(eq(users.name, username), eq(users.email, username)))
    .limit(1);

  const user = rows.at(0);
  if (!user || !user.password || !verifyPassword(password, user.password)) {
    return c.json({ message: "用户名或密码错误" }, 401);
  }

  await getDb()
    .update(users)
    .set({ lastSignInAt: new Date() })
    .where(eq(users.id, user.id));

  const token = await issueSession(c, user);
  return c.json({ token, user: toPublicUser(user) });
});

// 注册
authLocal.post("/register", async (c) => {
  const body = await c.req.json().catch(() => ({}) as any);
  const username = String(body.username ?? "").trim();
  const email = String(body.email ?? "").trim();
  const password = String(body.password ?? "");

  if (username.length < 2 || password.length < 6) {
    return c.json({ message: "用户名至少 2 位、密码至少 6 位" }, 400);
  }

  const db = getDb();
  const exists = await db
    .select()
    .from(users)
    .where(eq(users.name, username))
    .limit(1);
  if (exists.length > 0) {
    return c.json({ message: "用户名已存在" }, 409);
  }

  const unionId = `local:${username}`;
  await db.insert(users).values({
    unionId,
    name: username,
    email: email || null,
    password: hashPassword(password),
    role: "user",
  } as any);

  const rows = await db
    .select()
    .from(users)
    .where(eq(users.unionId, unionId))
    .limit(1);
  const user = rows.at(0)!;

  const token = await issueSession(c, user);
  return c.json({ token, user: toPublicUser(user) });
});

// 当前登录用户
authLocal.get("/me", async (c) => {
  const { authenticateRequest } = await import("./kimi/auth");
  try {
    const user = await authenticateRequest(c.req.raw.headers);
    return c.json({ user: toPublicUser(user as any) });
  } catch {
    return c.json({ message: "未登录" }, 401);
  }
});
