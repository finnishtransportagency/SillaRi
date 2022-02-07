--Supervision status was using supervision seq
ALTER TABLE sillari.supervision_status ALTER COLUMN id SET DEFAULT nextval('sillari.supervision_status_id_seq');

