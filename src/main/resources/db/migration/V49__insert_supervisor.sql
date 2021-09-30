INSERT INTO sillari.supervisor (firstname, lastname) VALUES ('Sillanvalvoja', 'Saara');
INSERT INTO sillari.supervisor (firstname, lastname) VALUES ('Varavalvoja', 'Ville');

--Add the test supervisor to first random 10 supervisions
INSERT INTO sillari.supervision_supervisor (supervision_id, supervisor_id, priority)
SELECT s.id, sr.id, 1
FROM supervision s CROSS JOIN (SELECT id FROM sillari.supervisor WHERE firstname = 'Sillanvalvoja' and lastname = 'Saara') sr
LIMIT 10;

INSERT INTO sillari.supervision_supervisor (supervision_id, supervisor_id, priority)
SELECT ss.id, sr.id, 2
FROM supervision_supervisor ss CROSS JOIN (SELECT id FROM sillari.supervisor WHERE firstname = 'Varavalvoja' and lastname = 'Ville') sr
WHERE ss.supervisor_id IS NOT NULL;
