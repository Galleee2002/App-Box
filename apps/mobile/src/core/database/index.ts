import * as SQLite from "expo-sqlite";

export type LocalDatabaseStatus = "idle" | "ready" | "error";

const MIGRATION_001 = `
CREATE TABLE IF NOT EXISTS capsules (
  id TEXT PRIMARY KEY NOT NULL,
  title TEXT NOT NULL,
  body TEXT NOT NULL,
  unlock_at TEXT NOT NULL,
  created_at TEXT NOT NULL
);
CREATE INDEX IF NOT EXISTS idx_capsules_unlock_at ON capsules (unlock_at);
`;

const MIGRATION_002 = `
ALTER TABLE capsules ADD COLUMN sync_status TEXT NOT NULL DEFAULT 'pending';
ALTER TABLE capsules ADD COLUMN updated_at TEXT;
UPDATE capsules SET updated_at = created_at WHERE updated_at IS NULL;
`;

const MIGRATION_003 = `
CREATE TABLE IF NOT EXISTS bucket_items (
  id TEXT PRIMARY KEY NOT NULL,
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  category TEXT NOT NULL,
  status TEXT NOT NULL,
  created_at TEXT NOT NULL,
  completed_at TEXT
);
CREATE INDEX IF NOT EXISTS idx_bucket_items_status_created
  ON bucket_items (status, created_at);
CREATE INDEX IF NOT EXISTS idx_bucket_items_completed_at
  ON bucket_items (completed_at);
`;

const MIGRATIONS = [MIGRATION_001, MIGRATION_002, MIGRATION_003];

let bootstrapStatus: LocalDatabaseStatus = "idle";
let bootstrapError: string | null = null;
let dbInstance: SQLite.SQLiteDatabase | null = null;
let initPromise: Promise<void> | null = null;

export function getDatabaseBootstrapStatus(): LocalDatabaseStatus {
  return bootstrapStatus;
}

export function getDatabaseBootstrapError(): string | null {
  return bootstrapError;
}

export async function initializeDatabase(): Promise<void> {
  if (bootstrapStatus === "ready" && dbInstance) {
    return;
  }

  if (initPromise) {
    return initPromise;
  }

  initPromise = (async () => {
    try {
      bootstrapStatus = "idle";
      bootstrapError = null;
      const db = await SQLite.openDatabaseAsync("lovebox.db");
      for (const migration of MIGRATIONS) {
        try {
          await db.execAsync(migration);
        } catch (error) {
          const message = error instanceof Error ? error.message : "";
          if (!message.includes("duplicate column name")) {
            throw error;
          }
        }
      }
      dbInstance = db;
      bootstrapStatus = "ready";
    } catch (error) {
      bootstrapStatus = "error";
      bootstrapError = error instanceof Error ? error.message : "No se pudo inicializar la base de datos.";
      dbInstance = null;
      throw error;
    } finally {
      initPromise = null;
    }
  })();

  return initPromise;
}

export function getDatabase(): SQLite.SQLiteDatabase {
  if (!dbInstance || bootstrapStatus !== "ready") {
    throw new Error("Database is not ready. Call initializeDatabase() first.");
  }
  return dbInstance;
}
