alter table if exists sillari.crossing_image drop constraint if exists crossing_image_crossing_id_fkey;
drop index if exists crossing_image_crossing_id;

alter table if exists sillari.crossing_image rename to supervision_image;
alter index if exists sillari.crossing_image_pkey rename to supervision_image_pkey;

alter table sillari.supervision_image rename column crossing_id to supervision_id;

alter table sillari.supervision_image add constraint supervision_image_supervision_id_fkey
    foreign key (supervision_id) references sillari.supervision (id) deferrable;

create index if not exists supervision_image_supervision_id ON sillari.supervision_image (supervision_id);

alter sequence if exists sillari.crossing_image_id_seq rename to supervision_image_id_seq;
