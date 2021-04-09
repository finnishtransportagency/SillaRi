alter table sillari.crossing add column draft boolean;
update sillari.crossing set draft=true;
