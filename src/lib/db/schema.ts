import {
  boolean,
  timestamp,
  pgTable,
  text,
  primaryKey,
  integer,
  serial,
  varchar,
  doublePrecision,
} from "drizzle-orm/pg-core";
import type { AdapterAccountType } from "next-auth/adapters";
import { number } from "zod";

export const users = pgTable("user", {
  id: text("id")
    .primaryKey()
    .$defaultFn(() => crypto.randomUUID()),
  name: text("name"),
  email: text("email").unique(),
  emailVerified: timestamp("emailVerified", { mode: "date" }),
  image: text("image"),
});

export const accounts = pgTable(
  "account",
  {
    userId: text("userId")
      .notNull()
      .references(() => users.id, { onDelete: "cascade" }),
    type: text("type").$type<AdapterAccountType>().notNull(),
    provider: text("provider").notNull(),
    providerAccountId: text("providerAccountId").notNull(),
    refresh_token: text("refresh_token"),
    access_token: text("access_token"),
    expires_at: integer("expires_at"),
    token_type: text("token_type"),
    scope: text("scope"),
    id_token: text("id_token"),
    session_state: text("session_state"),
  },
  (account) => ({
    compoundKey: primaryKey({
      columns: [account.provider, account.providerAccountId],
    }),
  })
);

export const sessions = pgTable("session", {
  sessionToken: text("sessionToken").primaryKey(),
  userId: text("userId")
    .notNull()
    .references(() => users.id, { onDelete: "cascade" }),
  expires: timestamp("expires", { mode: "date" }).notNull(),
});

export const verificationTokens = pgTable(
  "verificationToken",
  {
    identifier: text("identifier").notNull(),
    token: text("token").notNull(),
    expires: timestamp("expires", { mode: "date" }).notNull(),
  },
  (verificationToken) => ({
    compositePk: primaryKey({
      columns: [verificationToken.identifier, verificationToken.token],
    }),
  })
);

export const authenticators = pgTable(
  "authenticator",
  {
    credentialID: text("credentialID").notNull().unique(),
    userId: text("userId")
      .notNull()
      .references(() => users.id, { onDelete: "cascade" }),
    providerAccountId: text("providerAccountId").notNull(),
    credentialPublicKey: text("credentialPublicKey").notNull(),
    counter: integer("counter").notNull(),
    credentialDeviceType: text("credentialDeviceType").notNull(),
    credentialBackedUp: boolean("credentialBackedUp").notNull(),
    transports: text("transports"),
  },
  (authenticator) => ({
    compositePK: primaryKey({
      columns: [authenticator.userId, authenticator.credentialID],
    }),
  })
);

export const taskTable = pgTable("task", {
  id: serial("id").primaryKey(),
  userId: text("user_id").notNull(),
  t_id: text("t_id").notNull(),
  task_id: text("task_id"),
  model: text("model").notNull(),
  action: text("action").notNull(),
  LLM_Params: text("LLM_Params").notNull(),
  track_id: text("track_id"),
  result: text("result"),
  remark: text("remark"),
  type: text("type"),
  status: text("status").notNull(),
  createdAt: timestamp("created_at", { mode: "string" }).notNull().defaultNow(),
  updatedAt: timestamp("updated_at", { mode: "string" }).notNull().defaultNow(),
});

export type InsertTask = typeof taskTable.$inferInsert;

export const musicTable = pgTable("music", {
  id: serial("id").primaryKey(),
  suno_id: text("suno_id").notNull(),
  userId: text("user_id").notNull(),
  taskId: text("task_id").notNull(),
  lyric: text("lyric"),
  model: text("model").notNull(),
  style: text("style"),
  title: text("title"),
  prompt: text("prompt"),
  audio_url: text("audio_url"),
  image_url: text("image_url"),
  video_url: text("video_url"),
  state: text("state"),
  duration: doublePrecision("duration"),
  remark: text("remark"),
  type: text("type"),
  created_at: timestamp("created_at", { mode: "string" })
    .notNull()
    .defaultNow(),
  updated_at: timestamp("updated_at", { mode: "string" })
    .notNull()
    .defaultNow(),
  suno_audio_id: text("suno_audio_id"),
  status: text("status").notNull().default("pending"),
});

export type InsertMusic = typeof musicTable.$inferInsert;
export type SelectMusic = typeof musicTable.$inferSelect;
