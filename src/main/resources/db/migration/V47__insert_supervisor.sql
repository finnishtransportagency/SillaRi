INSERT INTO sillari.supervisor (firstname, lastname) VALUES ('Testi', 'Valvoja');

--Add the test supervisor to first random 10 supervisions
INSERT INTO sillari.supervision_supervisor (supervision_id, supervisor_id, priority)
SELECT s.id, sr.id, 1
FROM supervision s CROSS JOIN (SELECT id FROM sillari.supervisor WHERE firstname = 'Testi' and lastname = 'Valvoja') sr
LIMIT 10;
