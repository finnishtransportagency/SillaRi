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



--Supervision
alter table sillari.supervision
    drop column if exists status;
