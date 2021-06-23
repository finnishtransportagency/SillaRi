--Supervision status
create sequence if not exists sillari.supervision_status_id_seq;

create table if not exists sillari.supervision_status
(
    id             integer not null DEFAULT nextval('sillari.supervision_id_seq'),
    supervision_id integer not null,
    status         text, --planned, cancelled, in progress, finished
    time           timestamp with time zone,
    PRIMARY KEY (id),
    CONSTRAINT supervision_status_supervision_id_fkey FOREIGN KEY (supervision_id) REFERENCES sillari.supervision (id) DEFERRABLE
);

create index if not exists supervision_status_supervision_id on sillari.supervision_status (supervision_id);
create index if not exists supervision_latest_status on sillari.supervision_status (supervision_id, time);

--Random (between 1-9) date and time in August 2021
insert into sillari.supervision_status (supervision_id, status, time)
select s.id,
       'PLANNED',
       ('2021-08-0' || (floor(random() * (9 - 1 + 1) + 1)::int) || ' 0' || (floor(random() * (9 - 1 + 1) + 1)::int) ||
        ':0' || (floor(random() * (9 - 1 + 1) + 1)::int) || ':00 +03:00')::timestamp
from sillari.supervision s;

--Supervision
alter table sillari.supervision
    drop column if exists status;
