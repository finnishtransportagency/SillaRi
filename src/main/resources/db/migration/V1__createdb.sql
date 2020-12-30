CREATE SCHEMA sillari;
CREATE SEQUENCE transport_id_seq;
CREATE SEQUENCE address_id_seq;

CREATE TABLE sillari.address(
    id integer NOT NULL DEFAULT nextval('address_id_seq'),
    street text,
    postalcode text,
    city text,
    CONSTRAINT address_pkey PRIMARY KEY (id)
);

CREATE TABLE sillari.transport
(
    id integer NOT NULL DEFAULT nextval('transport_id_seq'),
    title text,
    departure_address_id integer,
    arrival_address_id integer,
    CONSTRAINT fk_departure_address_id foreign key (departure_address_id) references sillari.address(id),
    CONSTRAINT fk_arrival_address_id foreign key (arrival_address_id) references sillari.address(id),
    CONSTRAINT transport_pkey PRIMARY KEY (id)
);

--ALTER TABLE sillari.transport
--    OWNER to sillari;

