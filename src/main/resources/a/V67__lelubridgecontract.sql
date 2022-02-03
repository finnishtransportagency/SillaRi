alter table sillari.permit drop column IF EXISTS contract_number;
alter table sillari.route_bridge add column if not exists contract_number bigint;