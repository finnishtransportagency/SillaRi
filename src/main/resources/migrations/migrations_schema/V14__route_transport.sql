--Transport instance on route
create sequence if not exists sillari.route_transport_id_seq;

create table if not exists sillari.route_transport
(
    id                       integer not null DEFAULT nextval('sillari.route_transport_id_seq'),
    route_id                 integer not null,
    departure_time           timestamp with time zone,
    arrival_time             timestamp with time zone,
    status                   text, --lähtenyt (departed), pysähtynyt (stopped), ajossa (in progress), perillä (arrived)
    current_location         text, --TODO
    current_location_updated timestamp with time zone,
    PRIMARY KEY (id),
    CONSTRAINT route_transport_route_id_fkey FOREIGN KEY (route_id) REFERENCES sillari.route (id) DEFERRABLE
);

create index if not exists route_transport_route_id on sillari.route_transport (route_id);
