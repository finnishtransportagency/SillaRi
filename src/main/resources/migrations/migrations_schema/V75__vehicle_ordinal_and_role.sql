alter table sillari.vehicle add column if not exists ordinal int;
comment on column sillari.vehicle.ordinal is 'Ordinal number of the vehicle in the permit';


alter table sillari.vehicle add column if not exists role text;

