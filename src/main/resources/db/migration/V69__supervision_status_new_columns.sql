ALTER TABLE sillari.supervision_status ADD COLUMN IF NOT EXISTS reason text;
ALTER TABLE sillari.supervision_status ADD COLUMN IF NOT EXISTS username text;

UPDATE sillari.supervision_status ss SET reason = (SELECT s.deny_crossing_reason FROM sillari.supervision s WHERE ss.supervision_id = s.id);
UPDATE sillari.supervision_status ss SET username = 'T012345' WHERE username IS NULL; --Local development user

ALTER TABLE sillari.supervision DROP COLUMN IF EXISTS deny_crossing_reason;
