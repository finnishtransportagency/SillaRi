alter table sillari.supervision_report rename column bendings_displacements to bends_displacements;
alter table sillari.supervision_report add column if not exists draft boolean;
alter table sillari.supervision_report add column if not exists created timestamp with time zone;
alter table sillari.supervision_report add column if not exists modified timestamp with time zone;
