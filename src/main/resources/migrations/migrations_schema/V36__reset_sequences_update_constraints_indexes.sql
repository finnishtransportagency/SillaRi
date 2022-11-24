
--Rename primary key constraints referring to old table names
alter table sillari.permit rename constraint authorization_pkey to permit_pkey;
alter table sillari.route_bridge rename constraint routesbridges_pkey to route_bridge_pkey;

--Add missing foreign key indexes
create index if not exists supervision_report_supervision_id ON sillari.supervision_report (supervision_id);
create index if not exists supervision_supervisor_id ON sillari.supervision (supervisor_id);
create index if not exists transport_dimensions_permit_id ON sillari.transport_dimensions (permit_id);
create index if not exists unloaded_transport_dimensions_permit_id ON sillari.unloaded_transport_dimensions (permit_id);
create index if not exists vehicle_permit_id ON sillari.vehicle (permit_id);
create index if not exists axle_chart_permit_id ON sillari.axle_chart (permit_id);
create index if not exists axle_axle_chart_id ON sillari.axle (axle_chart_id);
create index if not exists route_transport_driver_route_transport_id ON sillari.route_transport_driver (route_transport_id);
