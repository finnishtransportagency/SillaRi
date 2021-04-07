create sequence crossing_image_id_seq;

create table crossing_image(
   id   integer NOT NULL DEFAULT nextval('crossing_image_id_seq'),
   crossing_id integer not null,
   taken timestamp without time zone,
   filename text,
   object_key text,
   primary key(id)
);

create sequence bridge_image_id_seq;

create table bridge_image(
   id   integer NOT NULL DEFAULT nextval('bridge_image_id_seq'),
   bridge_id integer not null,
   taken timestamp without time zone,
   filename text,
   object_key text,
   primary key(id)
)
