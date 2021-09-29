ALTER TABLE sillari.supervision ADD COLUMN IF NOT EXISTS supervisor_type text;
UPDATE sillari.supervision SET supervisor_type = 'OWN_SUPERVISOR';
