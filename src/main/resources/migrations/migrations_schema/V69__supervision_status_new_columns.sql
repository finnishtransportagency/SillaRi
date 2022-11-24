ALTER TABLE sillari.supervision_status ADD COLUMN IF NOT EXISTS reason text;
ALTER TABLE sillari.supervision_status ADD COLUMN IF NOT EXISTS username text;
ALTER TABLE sillari.supervision DROP COLUMN IF EXISTS deny_crossing_reason;
