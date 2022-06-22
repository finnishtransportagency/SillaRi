alter table sillari.route add column if not exists ordinal int;
comment on column sillari.route.ordinal is 'Ordinal number of the route in the permit';

--Update missing route ordinals in test data with route ID, it's the safest bet for the order they have been sent in from LeLu
update sillari.route r set ordinal = r.id where r.ordinal is null;
