CREATE SEQUENCE IF NOT EXISTS sillari.supervision_supervisor_id_seq;

CREATE TABLE IF NOT EXISTS sillari.supervision_supervisor (
    id integer not null DEFAULT nextval('sillari.supervision_supervisor_id_seq'),
    supervision_id integer not null,
    supervisor_id integer not null,
    priority integer not null,
    PRIMARY KEY (id),
    CONSTRAINT supervision_supervisor_supervision_id_fkey FOREIGN KEY (supervision_id) REFERENCES supervision (id) DEFERRABLE,
    CONSTRAINT supervision_supervisor_supervisor_id_fkey FOREIGN KEY (supervisor_id) REFERENCES supervisor (id) DEFERRABLE
);

INSERT INTO sillari.supervision_supervisor (supervision_id, supervisor_id, priority)
SELECT s.id, s.supervisor_id, 1
FROM supervision s
WHERE s.supervisor_id IS NOT NULL
AND NOT EXISTS (
    SELECT 1 FROM sillari.supervision_supervisor ss WHERE ss.id = s.id AND ss.supervisor_id = s.supervisor_id
)
ORDER BY s.id;

CREATE INDEX IF NOT EXISTS supervision_supervisor_supervision_id ON sillari.supervision_supervisor (supervision_id);
CREATE INDEX IF NOT EXISTS supervision_supervisor_supervisor_id ON sillari.supervision_supervisor (supervisor_id);

ALTER TABLE sillari.supervision DROP COLUMN IF EXISTS supervisor_id;
