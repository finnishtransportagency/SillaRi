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

CREATE SEQUENCE IF NOT EXISTS axle_chart_id_seq;

CREATE TABLE IF NOT EXISTS sillari.axle_chart
(
    id integer NOT NULL DEFAULT nextval('axle_chart_id_seq'),
    permit_id integer not null,
    CONSTRAINT fk_axle_chart_permit_id foreign key (permit_id) references sillari.permit(id),
    CONSTRAINT axle_chart_pkey PRIMARY KEY (id)
);

ALTER TABLE sillari.permit ADD COLUMN IF NOT EXISTS total_mass decimal;

ALTER TABLE sillari.axle DROP COLUMN IF EXISTS transport_id;
ALTER TABLE sillari.axle ADD COLUMN IF NOT EXISTS axle_chart_id integer not null;
ALTER TABLE sillari.axle ADD CONSTRAINT axle_chart_id_fkey FOREIGN KEY (axle_chart_id) REFERENCES axle_chart (id) DEFERRABLE;

DROP TABLE IF EXISTS sillari.transport_registration CASCADE;
DROP TABLE IF EXISTS sillari.transport CASCADE;

ALTER TABLE sillari.permit ADD COLUMN IF NOT EXISTS permit_version integer;
ALTER TABLE sillari.permit ADD COLUMN IF NOT EXISTS additional_details text;

ALTER TABLE sillari.company ADD COLUMN IF NOT EXISTS customer_id text;

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



