alter table sillari.bridge add column if not exists municipality text;

--Test data
update sillari.bridge b1 set municipality = (select 'municipality' || b2.id from sillari.bridge b2 where b1.id = b2.id);
