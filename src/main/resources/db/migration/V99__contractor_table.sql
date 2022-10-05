CREATE SEQUENCE contractor_id_seq;

CREATE TABLE sillari.contractor(
    id integer NOT NULL DEFAULT nextval('contractor_id_seq'),
    businesscode text,
    businessname text,
    CONSTRAINT contractor_pkey PRIMARY KEY (id)
);