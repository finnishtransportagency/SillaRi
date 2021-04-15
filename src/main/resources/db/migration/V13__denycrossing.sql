alter table sillari.crossing add column IF NOT EXISTS denied boolean;
alter table sillari.crossing add column IF NOT EXISTS deny_reason text;
update sillari.crossing set denied=false;

