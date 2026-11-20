import "server-only";
import { createClient, type Client, type InStatement, type Transaction } from "@libsql/client";
import { presets } from "./automations";

let opening: Promise<Client> | undefined;

async function openStore() {
  const url = process.env.TURSO_DATABASE_URL?.trim() || (process.env.NODE_ENV !== "production" ? "file:.smile-craft.db" : "");
  if (!url || (process.env.VERCEL && url.startsWith("file:"))) {
    throw new Error("Configure a persistent TURSO_DATABASE_URL for Smile Craft.");
  }
  const db = createClient({ url, authToken: process.env.TURSO_AUTH_TOKEN?.trim() || undefined });
  const schema: InStatement[] = [
    `CREATE TABLE IF NOT EXISTS bookings (
      id TEXT PRIMARY KEY, created_at TEXT NOT NULL, name TEXT NOT NULL, phone TEXT NOT NULL,
      email TEXT NOT NULL, location TEXT NOT NULL, service TEXT NOT NULL, date TEXT NOT NULL,
      message TEXT NOT NULL, status TEXT NOT NULL DEFAULT 'new', appointment_at TEXT, revision INTEGER NOT NULL DEFAULT 0)`,
    "CREATE INDEX IF NOT EXISTS bookings_created ON bookings(created_at DESC)",
    `CREATE TABLE IF NOT EXISTS automations (
      kind TEXT PRIMARY KEY, enabled INTEGER NOT NULL DEFAULT 1, subject TEXT NOT NULL,
      body TEXT NOT NULL, lead_hours INTEGER NOT NULL DEFAULT 24)`,
    `CREATE TABLE IF NOT EXISTS notifications (
      id TEXT PRIMARY KEY, booking_id TEXT NOT NULL REFERENCES bookings(id), kind TEXT NOT NULL,
      channel TEXT NOT NULL, recipient TEXT NOT NULL, subject TEXT NOT NULL, body TEXT NOT NULL,
      created_at TEXT NOT NULL, send_at TEXT, expires_at TEXT, status TEXT NOT NULL DEFAULT 'queued',
      worker_id TEXT, error TEXT NOT NULL DEFAULT '', obsolete INTEGER NOT NULL DEFAULT 0,
      attempt INTEGER NOT NULL DEFAULT 0, tries INTEGER NOT NULL DEFAULT 0, lease TEXT, lease_until INTEGER NOT NULL DEFAULT 0)`,
    "CREATE INDEX IF NOT EXISTS notices_booking ON notifications(booking_id)",
    "CREATE INDEX IF NOT EXISTS notices_status ON notifications(status, created_at)",
    "CREATE TABLE IF NOT EXISTS rate_limits (key TEXT PRIMARY KEY, count INTEGER NOT NULL, reset_at INTEGER NOT NULL)",
    ...Object.entries(presets).map(([kind, preset]) => ({
      sql: "INSERT INTO automations(kind, subject, body) VALUES(?, ?, ?) ON CONFLICT(kind) DO NOTHING",
      args: [kind, preset.subject, preset.body],
    })),
  ];
  try {
    await db.batch(schema, "write");
    return db;
  } catch (error) {
    db.close();
    throw error;
  }
}

export function database() {
  opening ??= openStore().catch(error => { opening = undefined; throw error; });
  return opening;
}

export async function rows<T>(statement: InStatement, client?: Client | Transaction): Promise<T[]> {
  const executor = client ?? await database();
  return (await executor.execute(statement)).rows as unknown as T[];
}

export async function write<T>(fn: (tx: Transaction) => Promise<T>) {
  const db = await database();
  const tx = await db.transaction("write");
  try {
    const result = await fn(tx);
    await tx.commit();
    return result;
  } finally {
    tx.close();
  }
}
