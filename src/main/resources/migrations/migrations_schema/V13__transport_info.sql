-- transport
ALTER TABLE sillari.transport ADD COLUMN IF NOT EXISTS height decimal;
ALTER TABLE sillari.transport ADD COLUMN IF NOT EXISTS width decimal;
ALTER TABLE sillari.transport ADD COLUMN IF NOT EXISTS length decimal;
ALTER TABLE sillari.transport ADD COLUMN IF NOT EXISTS total_mass decimal;

-- transport_registration
CREATE SEQUENCE IF NOT EXISTS sillari.transport_registration_id_seq;

CREATE TABLE IF NOT EXISTS sillari.transport_registration (
    id integer not null DEFAULT nextval('sillari.transport_registration_id_seq'),
    transport_id integer not null,
    registration_number text,
    PRIMARY KEY (id),
    CONSTRAINT transport_registration_transport_id_fkey FOREIGN KEY (transport_id) REFERENCES transport (id) DEFERRABLE
);

CREATE INDEX IF NOT EXISTS transport_registration_transport_id ON sillari.transport_registration (transport_id);

-- axle
CREATE SEQUENCE IF NOT EXISTS sillari.axle_id_seq;

CREATE TABLE IF NOT EXISTS sillari.axle (
    id integer not null DEFAULT nextval('sillari.axle_id_seq'),
    transport_id integer not null,
    axle_number integer,
    weight integer,
    distance_to_next decimal,
    max_distance_to_next decimal,
    PRIMARY KEY (id),
    CONSTRAINT axle_transport_id_fkey FOREIGN KEY (transport_id) REFERENCES transport (id) DEFERRABLE
);

CREATE INDEX IF NOT EXISTS axle_transport_id ON sillari.axle (transport_id);

