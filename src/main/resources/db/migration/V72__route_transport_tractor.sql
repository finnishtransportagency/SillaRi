alter table sillari.route_transport add column if not exists tractor_unit text;
comment on column sillari.route_transport.tractor_unit is 'Registration number of the tractor unit for identifying the transport'
