--Planned supervision
create sequence if not exists sillari.supervision_id_seq;

create table if not exists sillari.supervision
(
    id                 integer not null DEFAULT nextval('sillari.supervision_id_seq'),
    route_bridge_id    integer not null,
    route_transport_id integer not null,
    planned_time       timestamp with time zone,
    status             text,    --planned, cancelled, in progress, finished
    conforms_to_permit boolean, --transport is checked against description in permit
    PRIMARY KEY (id),
    CONSTRAINT supervision_route_bridge_id_fkey FOREIGN KEY (route_bridge_id) REFERENCES sillari.route_bridge (id) DEFERRABLE,
    CONSTRAINT supervision_route_transport_id_fkey FOREIGN KEY (route_transport_id) REFERENCES sillari.route_transport (id) DEFERRABLE
);

create index if not exists supervision_route_bridge_id on sillari.supervision (route_bridge_id);
create index if not exists supervision_route_transport_id on sillari.supervision (route_transport_id);

