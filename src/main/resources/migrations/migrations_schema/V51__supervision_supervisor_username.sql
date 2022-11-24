-- The username is needed for the KVH implementation
-- After this, the supervisor table and supervisor_id column can be removed
ALTER TABLE sillari.supervision_supervisor ADD COLUMN IF NOT EXISTS username text;
