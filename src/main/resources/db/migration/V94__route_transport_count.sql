create sequence IF NOT EXISTS sillari.route_transport_count_id_seq;

create table IF NOT EXISTS sillari.route_transport_count(
    id integer NOT NULL DEFAULT nextval('route_transport_count_id_seq'),
    route_id integer not null,
    route_transport_id integer,
    count integer,
    used boolean,
    row_created_time timestamp with time zone default now(),
    row_updated_time timestamp with time zone,
    primary key(id),
    CONSTRAINT route_transport_count_route_id_fkey FOREIGN KEY (route_id) REFERENCES sillari.route (id) DEFERRABLE,
    CONSTRAINT route_transport_count_route_transport_id_fkey FOREIGN KEY (route_transport_id) REFERENCES sillari.route_transport (id) DEFERRABLE
);

CREATE TRIGGER route_transport_count_row_updated
    BEFORE UPDATE ON sillari.route_transport_count
    FOR EACH ROW
EXECUTE PROCEDURE update_row_updated_time();
