-- authorization -> permit
ALTER TABLE sillari.authorization RENAME TO permit;
ALTER TABLE sillari.permit RENAME CONSTRAINT authorization_pkey TO permit_pkey;
ALTER TABLE sillari.permit RENAME COLUMN permissionid TO permit_number;
ALTER TABLE sillari.permit RENAME COLUMN validStartDate TO valid_start_date;
ALTER TABLE sillari.permit RENAME COLUMN validEndDate TO valid_end_date;
ALTER TABLE sillari.permit ADD CONSTRAINT permit_company_id_fkey FOREIGN KEY (company_id) REFERENCES company (id) DEFERRABLE INITIALLY IMMEDIATE;

ALTER SEQUENCE sillari.authorization_id_seq RENAME TO permit_id_seq;

ALTER INDEX sillari.authorization_company_id RENAME TO permit_company_id;

-- bridge
ALTER TABLE sillari.bridge RENAME COLUMN shortname TO identifier;

-- bridge_image
ALTER TABLE sillari.bridge_image ADD CONSTRAINT bridge_image_bridge_id_fkey FOREIGN KEY (bridge_id) REFERENCES bridge (id) DEFERRABLE INITIALLY IMMEDIATE;

CREATE INDEX bridge_image_bridge_id ON sillari.bridge_image (bridge_id);

-- route
ALTER TABLE sillari.route RENAME COLUMN authorization_id TO permit_id;
ALTER TABLE sillari.route ADD CONSTRAINT route_permit_id_fkey FOREIGN KEY (permit_id) REFERENCES permit (id) DEFERRABLE INITIALLY IMMEDIATE;
ALTER TABLE sillari.route ADD CONSTRAINT route_departure_address_id_fkey FOREIGN KEY (departure_address_id) REFERENCES address (id) DEFERRABLE INITIALLY IMMEDIATE;
ALTER TABLE sillari.route ADD CONSTRAINT route_arrival_address_id_fkey FOREIGN KEY (arrival_address_id) REFERENCES address (id) DEFERRABLE INITIALLY IMMEDIATE;

ALTER INDEX sillari.route_authorization_id RENAME TO route_permit_id;

CREATE INDEX route_departure_address_id ON sillari.route (departure_address_id);
CREATE INDEX route_arrival_address_id ON sillari.route (arrival_address_id);

-- routesbridges -> route_bridge
ALTER TABLE sillari.routesbridges RENAME TO route_bridge;
ALTER TABLE sillari.route_bridge RENAME CONSTRAINT routesbridges_pkey TO route_bridge_pkey;
ALTER TABLE sillari.route_bridge RENAME COLUMN routeid TO route_id;
ALTER TABLE sillari.route_bridge RENAME COLUMN bridgeid TO bridge_id;
ALTER TABLE sillari.route_bridge ADD CONSTRAINT route_bridge_route_id_fkey FOREIGN KEY (route_id) REFERENCES route (id) DEFERRABLE INITIALLY IMMEDIATE;
ALTER TABLE sillari.route_bridge ADD CONSTRAINT route_bridge_bridge_id_fkey FOREIGN KEY (bridge_id) REFERENCES bridge (id) DEFERRABLE INITIALLY IMMEDIATE;

ALTER SEQUENCE sillari.routesbridges_id_seq RENAME TO route_bridge_id_seq;

CREATE INDEX route_bridge_route_id ON sillari.route_bridge (route_id);
CREATE INDEX route_bridge_bridge_id ON sillari.route_bridge (bridge_id);

-- crossing
ALTER TABLE sillari.crossing RENAME COLUMN route_id TO route_bridge_id;
ALTER TABLE sillari.crossing DROP COLUMN bridge_id;
ALTER TABLE sillari.crossing ADD CONSTRAINT crossing_route_bridge_id_fkey FOREIGN KEY (route_bridge_id) REFERENCES route_bridge (id) DEFERRABLE INITIALLY IMMEDIATE;

CREATE INDEX crossing_route_bridge_id ON sillari.crossing (route_bridge_id);

-- crossing_image
ALTER TABLE sillari.crossing_image ADD CONSTRAINT crossing_image_crossing_id_fkey FOREIGN KEY (crossing_id) REFERENCES crossing (id) DEFERRABLE INITIALLY IMMEDIATE;

CREATE INDEX crossing_image_crossing_id ON sillari.crossing_image (crossing_id);

-- transport
ALTER TABLE sillari.transport DROP COLUMN departure_address_id;
ALTER TABLE sillari.transport DROP COLUMN arrival_address_id;
ALTER TABLE sillari.transport DROP COLUMN company_id;
ALTER TABLE sillari.transport DROP COLUMN begindate;
ALTER TABLE sillari.transport DROP COLUMN enddate;
ALTER TABLE sillari.transport RENAME COLUMN title TO name;
ALTER TABLE sillari.transport ADD COLUMN permit_id integer;
ALTER TABLE sillari.transport ADD COLUMN route_id integer;
ALTER TABLE sillari.transport ADD CONSTRAINT transport_permit_id_fkey FOREIGN KEY (permit_id) REFERENCES permit (id) DEFERRABLE INITIALLY IMMEDIATE;
ALTER TABLE sillari.transport ADD CONSTRAINT transport_route_id_fkey FOREIGN KEY (route_id) REFERENCES route (id) DEFERRABLE INITIALLY IMMEDIATE;

CREATE INDEX transport_permit_id ON sillari.transport (permit_id);
CREATE INDEX transport_route_id ON sillari.transport (route_id);

-- transportsbridge
DROP TABLE sillari.transportsbridge;

DROP SEQUENCE sillari.transportsbridge_id_seq;
