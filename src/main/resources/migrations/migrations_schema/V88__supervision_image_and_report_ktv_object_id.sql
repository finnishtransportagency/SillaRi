alter table sillari.supervision_report add column if not exists pdf_ktv_object_id text;
alter table sillari.supervision_image add column if not exists ktv_object_id text;
