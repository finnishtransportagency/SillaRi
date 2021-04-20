-- transport
ALTER TABLE sillari.transport ADD COLUMN IF NOT EXISTS height decimal;
ALTER TABLE sillari.transport ADD COLUMN IF NOT EXISTS width decimal;
ALTER TABLE sillari.transport ADD COLUMN IF NOT EXISTS length decimal;
ALTER TABLE sillari.transport ADD COLUMN IF NOT EXISTS total_mass decimal;

-- transport_registration
CREATE SEQUENCE IF NOT EXISTS sillari.transport_registration_id_seq;

CREATE TABLE IF NOT EXISTS sillari.transport_registration (
    id integer not null DEFAULT nextval('transport_registration_id_seq'),
    transport_id integer not null,
    registration_number text,
    PRIMARY KEY (id),
    CONSTRAINT transport_registration_transport_id_fkey FOREIGN KEY (transport_id) REFERENCES transport (id) DEFERRABLE
);

CREATE INDEX IF NOT EXISTS transport_registration_transport_id ON sillari.transport_registration (transport_id);

-- axle
CREATE SEQUENCE IF NOT EXISTS sillari.axle_id_seq;

CREATE TABLE IF NOT EXISTS sillari.axle (
    id integer not null DEFAULT nextval('axle_id_seq'),
    transport_id integer not null,
    axle_number integer,
    weight integer,
    distance_to_next decimal,
    max_distance_to_next decimal,
    PRIMARY KEY (id),
    CONSTRAINT axle_transport_id_fkey FOREIGN KEY (transport_id) REFERENCES transport (id) DEFERRABLE
);

CREATE INDEX IF NOT EXISTS axle_transport_id ON sillari.axle (transport_id);

-- test data
UPDATE sillari.transport SET permit_id = id, route_id = id, height = 4.5, width = 3.48, length = 25, total_mass = 93;

DELETE FROM sillari.transport_registration;
INSERT INTO sillari.transport_registration (transport_id, registration_number) SELECT id, 'AAA-123' FROM sillari.transport ORDER BY id;
INSERT INTO sillari.transport_registration (transport_id, registration_number) SELECT id, 'BBB-456' FROM sillari.transport ORDER BY id;

DELETE FROM sillari.axle;
INSERT INTO sillari.axle (transport_id, axle_number, weight, distance_to_next) SELECT id, 1, 10, 2.93 FROM sillari.transport ORDER BY id;
INSERT INTO sillari.axle (transport_id, axle_number, weight, distance_to_next) SELECT id, 2, 7.5, 1.32 FROM sillari.transport ORDER BY id;
INSERT INTO sillari.axle (transport_id, axle_number, weight, distance_to_next) SELECT id, 3, 14.55, 1.37 FROM sillari.transport ORDER BY id;
INSERT INTO sillari.axle (transport_id, axle_number, weight, distance_to_next) SELECT id, 4, 14.55, 10.8 FROM sillari.transport ORDER BY id;
INSERT INTO sillari.axle (transport_id, axle_number, weight, distance_to_next) SELECT id, 5, 12, 1.35 FROM sillari.transport ORDER BY id;
INSERT INTO sillari.axle (transport_id, axle_number, weight, distance_to_next) SELECT id, 6, 12, 1.35 FROM sillari.transport ORDER BY id;
INSERT INTO sillari.axle (transport_id, axle_number, weight, distance_to_next) SELECT id, 7, 12, 1.35 FROM sillari.transport ORDER BY id;
INSERT INTO sillari.axle (transport_id, axle_number, weight, distance_to_next) SELECT id, 8, 12, 0 FROM sillari.transport ORDER BY id;
