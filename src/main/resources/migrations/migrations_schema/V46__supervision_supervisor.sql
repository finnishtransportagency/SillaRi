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



CREATE INDEX IF NOT EXISTS supervision_supervisor_supervision_id ON sillari.supervision_supervisor (supervision_id);
CREATE INDEX IF NOT EXISTS supervision_supervisor_supervisor_id ON sillari.supervision_supervisor (supervisor_id);

ALTER TABLE sillari.supervision DROP COLUMN IF EXISTS supervisor_id;
