ALTER TABLE sillari.supervision ADD COLUMN IF NOT EXISTS deny_crossing_reason text;
UPDATE sillari.supervision_status SET status = 'CROSSING_DENIED' WHERE status = 'CANCELLED';
