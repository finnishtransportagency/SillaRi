--Supervision status
create sequence if not exists sillari.route_transport_status_id_seq;

create table if not exists sillari.route_transport_status
(
    id                 integer not null DEFAULT nextval('sillari.route_transport_status_id_seq'),
    route_transport_id integer not null,
    status             text, --lähtenyt (departed), pysähtynyt (stopped), ajossa (in progress), perillä (arrived)
    time               timestamp with time zone,
    location           text, --TODO
    PRIMARY KEY (id),
    CONSTRAINT route_transport_status_route_transport_id_fkey FOREIGN KEY (route_transport_id) REFERENCES sillari.route_transport (id) DEFERRABLE
);

create index if not exists route_transport_status_route_transport_id on sillari.route_transport_status (route_transport_id);
create index if not exists route_transport_latest_status on sillari.route_transport_status (route_transport_id, time);

--Random (between 1-9) date and time in August 2021
insert into sillari.route_transport_status (route_transport_id, status, time)
select rt.id,
       'PLANNED',
       ('2021-08-0' || (floor(random() * (9 - 1 + 1) + 1)::int) || ' 0' || (floor(random() * (9 - 1 + 1) + 1)::int) ||
        ':0' || (floor(random() * (9 - 1 + 1) + 1)::int) || ':00 +03:00')::timestamptz
from sillari.route_transport rt;

--Route_transport
alter table sillari.route_transport
    drop column if exists departure_time,
    drop column if exists arrival_time,
    drop column if exists status,
    drop column if exists current_location,
    drop column if exists current_location_updated;

--Route
alter table sillari.route
    drop column if exists departure_time,
    drop column if exists arrival_time;
