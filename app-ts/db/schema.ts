import {
  mysqlTable,
  mysqlEnum,
  int,
  varchar,
  text,
  timestamp,
  json,
  bigint,
} from "drizzle-orm/mysql-core";

export const users = mysqlTable("users", {
  id: int("id").autoincrement().primaryKey(),
  unionId: varchar("unionId", { length: 255 }).notNull().unique(),
  name: varchar("name", { length: 255 }),
  email: varchar("email", { length: 320 }),
  avatar: text("avatar"),
  purpose: varchar("purpose", { length: 20 }),
  role: mysqlEnum("role", ["user", "admin"]).default("user").notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt")
    .defaultNow()
    .notNull()
    .$onUpdate(() => new Date()),
  lastSignInAt: timestamp("lastSignInAt").defaultNow().notNull(),
});

export const templates = mysqlTable("templates", {
  id: int("id").autoincrement().primaryKey(),
  name: varchar("name", { length: 255 }).notNull(),
  description: text("description"),
  thumbnail: varchar("thumbnail", { length: 500 }).notNull(),
  category: mysqlEnum("category", ["job", "academic", "universal"]).default("universal").notNull(),
  tags: json("tags").$type<string[]>().notNull().$default(() => []),
  style: mysqlEnum("style", ["minimal", "professional", "creative", "academic", "tech", "elegant", "fresh"]).default("minimal").notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
});

export const resumes = mysqlTable("resumes", {
  id: int("id").autoincrement().primaryKey(),
  userId: bigint("userId", { mode: "number", unsigned: true }).notNull(),
  templateId: bigint("templateId", { mode: "number", unsigned: true }).notNull(),
  title: varchar("title", { length: 255 }).notNull(),
  purpose: mysqlEnum("purpose", ["job", "academic"]).default("job").notNull(),
  data: json("data").$type<Record<string, unknown>>().notNull().$default(() => ({})),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt")
    .defaultNow()
    .notNull()
    .$onUpdate(() => new Date()),
});

export const peots = mysqlTable("peots", {
  id: int("id").autoincrement().primaryKey(),
  name: varchar("name", { length: 255 }).notNull(),
  gender: mysqlEnum("gender", ["男", "女"]).default("男").notNull(),
  dynasty: varchar("dynasty", { length: 50 }).notNull(),
  title: varchar("title", { length: 255 }),
  style: varchar("style", { length: 500 }),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt")
    .defaultNow()
    .notNull()
    .$onUpdate(() => new Date()),
});

export type User = typeof users.$inferSelect;
export type InsertUser = typeof users.$inferInsert;
export type Template = typeof templates.$inferSelect;
export type InsertTemplate = typeof templates.$inferInsert;
export type Resume = typeof resumes.$inferSelect;
export type InsertResume = typeof resumes.$inferInsert;
export type Peot = typeof peots.$inferSelect;
export type InsertPeot = typeof peots.$inferInsert;