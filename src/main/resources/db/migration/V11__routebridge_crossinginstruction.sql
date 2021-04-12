alter table sillari.route_bridge add column if not exists crossing_instruction text;

--Test data
update sillari.route_bridge set crossing_instruction = 'Ajoneuvon keskilinjan oltava 4,25 metrin etäisyydellä idänpuoleisesta kaiteesta.';
