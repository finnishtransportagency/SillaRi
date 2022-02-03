CREATE SEQUENCE IF NOT EXISTS transport_dimensions_id_seq;

CREATE TABLE IF NOT EXISTS sillari.transport_dimensions
(
    id integer NOT NULL DEFAULT nextval('transport_dimensions_id_seq'),
    permit_id integer not null,
    height decimal,
    width decimal,
    length decimal,
    CONSTRAINT fk_transport_dimensions_permit_id foreign key (permit_id) references sillari.permit(id),
    CONSTRAINT transport_dimensions_pkey PRIMARY KEY (id)
);

DELETE FROM sillari.transport_dimensions;
INSERT INTO sillari.transport_dimensions (permit_id, height, width, length) SELECT id, 4.5, 3.48, 25 FROM sillari.permit ORDER BY id;

CREATE SEQUENCE IF NOT EXISTS axle_chart_id_seq;

CREATE TABLE IF NOT EXISTS sillari.axle_chart
(
    id integer NOT NULL DEFAULT nextval('axle_chart_id_seq'),
    permit_id integer not null,
    CONSTRAINT fk_axle_chart_permit_id foreign key (permit_id) references sillari.permit(id),
    CONSTRAINT axle_chart_pkey PRIMARY KEY (id)
);

DELETE FROM sillari.axle_chart;
INSERT INTO sillari.axle_chart (permit_id) SELECT id FROM sillari.permit ORDER BY id;

ALTER TABLE sillari.permit ADD COLUMN IF NOT EXISTS total_mass decimal;
UPDATE sillari.permit SET total_mass = 93;

TRUNCATE TABLE sillari.axle;
ALTER TABLE sillari.axle DROP COLUMN IF EXISTS transport_id;
ALTER TABLE sillari.axle ADD COLUMN IF NOT EXISTS axle_chart_id integer not null;
ALTER TABLE sillari.axle ADD CONSTRAINT axle_chart_id_fkey FOREIGN KEY (axle_chart_id) REFERENCES axle_chart (id) DEFERRABLE;

DROP TABLE IF EXISTS sillari.transport_registration CASCADE;
DROP TABLE IF EXISTS sillari.transport CASCADE;
DELETE FROM sillari.axle;
INSERT INTO sillari.axle (axle_chart_id, axle_number, weight, distance_to_next) SELECT id, 1, 10, 2.93 FROM sillari.axle_chart ORDER BY id;
INSERT INTO sillari.axle (axle_chart_id, axle_number, weight, distance_to_next) SELECT id, 2, 7.5, 1.32 FROM sillari.axle_chart ORDER BY id;
INSERT INTO sillari.axle (axle_chart_id, axle_number, weight, distance_to_next) SELECT id, 3, 14.55, 1.37 FROM sillari.axle_chart ORDER BY id;
INSERT INTO sillari.axle (axle_chart_id, axle_number, weight, distance_to_next) SELECT id, 4, 14.55, 10.8 FROM sillari.axle_chart ORDER BY id;
INSERT INTO sillari.axle (axle_chart_id, axle_number, weight, distance_to_next) SELECT id, 5, 12, 1.35 FROM sillari.axle_chart ORDER BY id;
INSERT INTO sillari.axle (axle_chart_id, axle_number, weight, distance_to_next) SELECT id, 6, 12, 1.35 FROM sillari.axle_chart ORDER BY id;
INSERT INTO sillari.axle (axle_chart_id, axle_number, weight, distance_to_next) SELECT id, 7, 12, 1.35 FROM sillari.axle_chart ORDER BY id;
INSERT INTO sillari.axle (axle_chart_id, axle_number, weight, distance_to_next) SELECT id, 8, 12, 0 FROM sillari.axle_chart ORDER BY id;

ALTER TABLE sillari.permit ADD COLUMN IF NOT EXISTS permit_version integer;
ALTER TABLE sillari.permit ADD COLUMN IF NOT EXISTS additional_details text;
UPDATE sillari.permit SET permit_version = 1;
UPDATE sillari.permit SET additional_details = 'blaa blaa';

ALTER TABLE sillari.company ADD COLUMN IF NOT EXISTS customer_id text;
UPDATE sillari.company SET customer_id = 1;

CREATE SEQUENCE IF NOT EXISTS vehicle_id_seq;
CREATE TABLE IF NOT EXISTS sillari.vehicle
(
    id integer NOT NULL DEFAULT nextval('vehicle_id_seq'),
    permit_id integer not null,
    type text,
    identifier text,
    CONSTRAINT fk_vehicle_permit_id foreign key (permit_id) references sillari.permit(id),
    CONSTRAINT vehicle_pkey PRIMARY KEY (id)
);

INSERT INTO sillari.vehicle (permit_id, type, identifier) SELECT id, 'kuorma-auto', 'AAA-123' FROM sillari.permit ORDER BY id;
INSERT INTO sillari.vehicle (permit_id, type, identifier) SELECT id, 'lavetti', 'BBB-456' FROM sillari.permit ORDER BY id;



