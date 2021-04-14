alter table sillari.crossing add column IF NOT EXISTS denied boolean;
update sillari.crossing set denied=false;
