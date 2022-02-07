-- The supervisor table is temporarily in use until the KVH implementation is done
-- The username is needed here so the value can be populated into supervision_supervisor
ALTER TABLE sillari.supervisor ADD COLUMN IF NOT EXISTS username text;

