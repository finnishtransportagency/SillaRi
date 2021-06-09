alter table sillari.route add column if not exists lelu_id bigint;
alter table sillari.route add column if not exists order_number integer;
alter table sillari.route add column if not exists transport_count integer;
alter table sillari.route add column if not exists alternative_route boolean default false;

alter table sillari.permit drop column if exists valid_start_date;
alter table sillari.permit drop column if exists valid_end_date;

alter table sillari.permit rename column permit_version to lelu_version;
alter table sillari.permit add column if not exists lelu_last_modified_date timestamp with time zone;
alter table sillari.permit add column if not exists valid_start_date timestamp with time zone;
alter table sillari.permit add column if not exists valid_end_date timestamp with time zone;

update sillari.permit set lelu_version = 1;
update sillari.permit set lelu_last_modified_date = '2021-01-01 08:00:00 +03:00';
update sillari.permit set valid_start_date = '2021-01-01 00:00:00 +03:00';
update sillari.permit set valid_end_date = '2022-01-01 00:00:00 +03:00';

alter table sillari.permit rename column total_mass to transport_total_mass;
alter table sillari.company rename column customer_id to business_id;

alter table sillari.bridge add column if not exists road_address text;
alter table sillari.axle alter column weight type numeric;

create index if not exists bridge_oid ON sillari.bridge (oid);
