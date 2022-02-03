--Supervisor
create sequence if not exists sillari.supervisor_id_seq;

create table if not exists sillari.supervisor
(
    id        integer not null DEFAULT nextval('sillari.supervisor_id_seq'),
    firstName text,
    lastName  text,
    PRIMARY KEY (id)
);

ALTER TABLE sillari.supervision ADD COLUMN supervisor_id integer;
ALTER TABLE sillari.supervision ADD CONSTRAINT supervision_supervisor_id_fkey FOREIGN KEY (supervisor_id) REFERENCES supervisor (id) DEFERRABLE;

with rows as (
    insert into sillari.supervisor (firstName, lastName) VALUES ('Silla', 'Superviisori') RETURNING id
)
UPDATE sillari.supervision SET supervisor_id =
(SELECT id
FROM rows)

