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


-- Add route_transport_number rows for each routes and max transport_number
do $$
    declare rt record;
    begin
        for rt in select r.id, r.transport_count
                  from sillari.route r
            loop
                for c in 1..rt.transport_count loop
                        insert into sillari.route_transport_count (route_id, count, used) values (rt.id, c, false);
                    end loop;
            end loop;
    end; $$;

-- Update route_transport_number as used when corresponding route_transport has been created
update sillari.route_transport_count rtc
set route_transport_id = (
    select rt.id from route_transport rt
    where rt.route_id = rtc.route_id and rt.transport_number = rtc.count
);

update sillari.route_transport_count rtn set used = true where rtn.route_transport_id is not null;
