alter table sillari.crossing add column IF NOT EXISTS draft boolean;
update sillari.crossing set draft=true;
