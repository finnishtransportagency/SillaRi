create sequence IF NOT EXISTS sillari.route_transport_number_id_seq;

create table IF NOT EXISTS sillari.route_transport_number(
    id integer NOT NULL DEFAULT nextval('route_transport_number_id_seq'),
    route_id integer not null,
    route_transport_id integer,
    transport_number integer,
    used boolean,
    row_created_time timestamp with time zone default now(),
    row_updated_time timestamp with time zone,
    primary key(id),
    CONSTRAINT route_transport_number_route_id_fkey FOREIGN KEY (route_id) REFERENCES sillari.route (id) DEFERRABLE,
    CONSTRAINT route_transport_number_route_transport_id_fkey FOREIGN KEY (route_transport_id) REFERENCES sillari.route_transport (id) DEFERRABLE
);

CREATE TRIGGER route_transport_number_row_updated
    BEFORE UPDATE ON sillari.route_transport_number
    FOR EACH ROW
EXECUTE PROCEDURE update_row_updated_time();

create index if not exists route_transport_number_route_id on sillari.route_transport_number (route_id);
create index if not exists route_transport_number_route_id_transport_number on sillari.route_transport_number (route_id, transport_number);


-- Add route_transport_number rows for each routes and max transport_number
do $$
    declare rt record;
    begin
        for rt in select r.id, r.transport_count
                  from sillari.route r
            loop
                for c in 1..rt.transport_count loop
                        insert into sillari.route_transport_number (route_id, transport_number, used) values (rt.id, c, false);
                    end loop;
            end loop;
    end; $$;

-- Update route_transport_number as used when corresponding route_transport has been created
update sillari.route_transport_number rtn
set route_transport_id = (
    select rt.id from route_transport rt
    where rt.route_id = rtn.route_id and rt.transport_number = rtn.transport_number
);

update sillari.route_transport_number rtn set used = true where rtn.route_transport_id is not null;
