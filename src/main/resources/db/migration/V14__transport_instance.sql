--Transportation (to be renamed later?)
create sequence if not exists sillari.transportation_id_seq;

create table if not exists sillari.transportation
(
    id                       integer not null DEFAULT nextval('sillari.transportation_id_seq'),
    permit_id                integer not null,
    route_id                 integer,
    departure_time           timestamp with time zone,
    arrival_time             timestamp with time zone,
    status                   text, --lähtenyt (departed), pysähtynyt (stopped), ajossa (in progress), perillä (arrived)
    current_location         text, --TODO
    current_location_updated timestamp with time zone,
    PRIMARY KEY (id),
    CONSTRAINT transportation_permit_id_fkey FOREIGN KEY (permit_id) REFERENCES permit (id) DEFERRABLE,
    CONSTRAINT transportation_route_id_fkey FOREIGN KEY (route_id) REFERENCES route (id) ON DELETE SET NULL DEFERRABLE
);

create index if not exists transportation_permit_id on sillari.transportation (permit_id);
create index if not exists transportation_route_id on sillari.transportation (route_id);

with r as (select permit_id, id from sillari.route limit 10)
insert into sillari.transportation (permit_id, route_id, departure_time, arrival_time, status)
select permit_id, id, '2021-09-22 05:05:05 +03:00', '2021-09-22 15:15:15 +03:00', 'ARRIVED' from r;
