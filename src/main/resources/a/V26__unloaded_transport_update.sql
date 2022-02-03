CREATE SEQUENCE IF NOT EXISTS unloaded_transport_dimensions_id_seq;

CREATE TABLE IF NOT EXISTS sillari.unloaded_transport_dimensions
(
    id integer NOT NULL DEFAULT nextval
(
    'unloaded_transport_dimensions_id_seq'
),
    permit_id integer not null,
    height decimal,
    width decimal,
    length decimal,
    CONSTRAINT fk_unloaded_transport_dimensions_permit_id foreign key
(
    permit_id
) references sillari.permit
(
    id
),
    CONSTRAINT unloaded_transport_dimensions_pkey PRIMARY KEY
(
    id
)
    );

DELETE
FROM sillari.unloaded_transport_dimensions;
INSERT INTO sillari.unloaded_transport_dimensions (permit_id, height, width, length)
SELECT id, 3.5, 2.48, 24
FROM sillari.permit
ORDER BY id;




