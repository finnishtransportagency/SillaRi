-- The supervisor table is temporarily in use until the KVH implementation is done
-- The username is needed here so the value can be populated into supervision_supervisor
ALTER TABLE sillari.supervisor ADD COLUMN IF NOT EXISTS username text;

-- Supervisor test data
UPDATE supervisor SET username = 'USER1' WHERE lastname = 'Sillanvalvoja';
UPDATE supervisor SET username = 'USER2' WHERE lastname = 'Varavalvoja';
