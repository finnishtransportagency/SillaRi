--Add created timestamps with default current timestamp when row is inserted
--Clear current timestamp in created column for old test data
alter table sillari.address add column if not exists row_created_time timestamp with time zone default now();
alter table sillari.address add column if not exists row_updated_time timestamp with time zone;
update sillari.address set row_created_time = null;

alter table sillari.axle add column if not exists row_created_time timestamp with time zone default now();
alter table sillari.axle add column if not exists row_updated_time timestamp with time zone;
update sillari.axle set row_created_time = null;

alter table sillari.axle_chart add column if not exists row_created_time timestamp with time zone default now();
alter table sillari.axle_chart add column if not exists row_updated_time timestamp with time zone;
update sillari.axle_chart set row_created_time = null;

alter table sillari.bridge add column if not exists row_created_time timestamp with time zone default now();
alter table sillari.bridge add column if not exists row_updated_time timestamp with time zone;
update sillari.bridge set row_created_time = null;

alter table sillari.bridge_image add column if not exists row_created_time timestamp with time zone default now();
alter table sillari.bridge_image add column if not exists row_updated_time timestamp with time zone;
update sillari.bridge_image set row_created_time = null;

alter table sillari.company add column if not exists row_created_time timestamp with time zone default now();
alter table sillari.company add column if not exists row_updated_time timestamp with time zone;
update sillari.company set row_created_time = null;

alter table sillari.permit add column if not exists row_created_time timestamp with time zone default now();
alter table sillari.permit add column if not exists row_updated_time timestamp with time zone;
update sillari.permit set row_created_time = null;

alter table sillari.route add column if not exists row_created_time timestamp with time zone default now();
alter table sillari.route add column if not exists row_updated_time timestamp with time zone;
update sillari.route set row_created_time = null;

alter table sillari.route_bridge add column if not exists row_created_time timestamp with time zone default now();
alter table sillari.route_bridge add column if not exists row_updated_time timestamp with time zone;
update sillari.route_bridge set row_created_time = null;

alter table sillari.route_transport add column if not exists row_created_time timestamp with time zone default now();
alter table sillari.route_transport add column if not exists row_updated_time timestamp with time zone;
update sillari.route_transport set row_created_time = null;

alter table sillari.route_transport_password add column if not exists row_created_time timestamp with time zone default now();
alter table sillari.route_transport_password add column if not exists row_updated_time timestamp with time zone;
update sillari.route_transport_password set row_created_time = null;

alter table sillari.route_transport_status add column if not exists row_created_time timestamp with time zone default now();
alter table sillari.route_transport_status add column if not exists row_updated_time timestamp with time zone;
update sillari.route_transport_status set row_created_time = null;

alter table sillari.supervision add column if not exists row_created_time timestamp with time zone default now();
alter table sillari.supervision add column if not exists row_updated_time timestamp with time zone;
update sillari.supervision set row_created_time = null;

alter table sillari.supervision_image add column if not exists row_created_time timestamp with time zone default now();
alter table sillari.supervision_image add column if not exists row_updated_time timestamp with time zone;
update sillari.supervision_image set row_created_time = null;

alter table sillari.supervision_report add column if not exists row_created_time timestamp with time zone default now();
alter table sillari.supervision_report add column if not exists row_updated_time timestamp with time zone;
update sillari.supervision_report set row_created_time = null;

alter table sillari.supervision_status add column if not exists row_created_time timestamp with time zone default now();
alter table sillari.supervision_status add column if not exists row_updated_time timestamp with time zone;
update sillari.supervision_status set row_created_time = null;

alter table sillari.supervision_supervisor add column if not exists row_created_time timestamp with time zone default now();
alter table sillari.supervision_supervisor add column if not exists row_updated_time timestamp with time zone;
update sillari.supervision_supervisor set row_created_time = null;

alter table sillari.supervisor add column if not exists row_created_time timestamp with time zone default now();
alter table sillari.supervisor add column if not exists row_updated_time timestamp with time zone;
update sillari.supervisor set row_created_time = null;

alter table sillari.transport_dimensions add column if not exists row_created_time timestamp with time zone default now();
alter table sillari.transport_dimensions add column if not exists row_updated_time timestamp with time zone;
update sillari.transport_dimensions set row_created_time = null;

alter table sillari.unloaded_transport_dimensions add column if not exists row_created_time timestamp with time zone default now();
alter table sillari.unloaded_transport_dimensions add column if not exists row_updated_time timestamp with time zone;
update sillari.unloaded_transport_dimensions set row_created_time = null;

alter table sillari.vehicle add column if not exists row_created_time timestamp with time zone default now();
alter table sillari.vehicle add column if not exists row_updated_time timestamp with time zone;
update sillari.vehicle set row_created_time = null;
