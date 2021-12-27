alter table sillari.vehicle add column if not exists ordinal int;
comment on column sillari.vehicle.ordinal is 'Ordinal number of the vehicle in the permit';

--Update missing vehicle ordinals in test data with vehicle ID, it's the safest bet for the order they have been sent in from LeLu
update sillari.vehicle v set ordinal = v.id where v.ordinal is null;

alter table sillari.vehicle add column if not exists role text;
