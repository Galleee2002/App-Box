ALTER TABLE capsules ADD COLUMN sync_status TEXT NOT NULL DEFAULT 'pending';
ALTER TABLE capsules ADD COLUMN updated_at TEXT;
UPDATE capsules SET updated_at = created_at WHERE updated_at IS NULL;
