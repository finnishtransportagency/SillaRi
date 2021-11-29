alter table sillari.route_bridge add column if not exists ordinal int;
comment on column sillari.route_bridge.ordinal is 'Ordinal number of the bridge on the route'
