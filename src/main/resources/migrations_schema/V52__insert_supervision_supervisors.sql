--Add the test supervisor to first random 10 supervisions
INSERT INTO sillari.supervision_supervisor (supervision_id, supervisor_id, priority, username)
SELECT s.id, sr.id, 1, 'USER1'
FROM supervision s CROSS JOIN (SELECT id FROM sillari.supervisor WHERE lastname = 'Sillanvalvoja') sr
LIMIT 10;

INSERT INTO sillari.supervision_supervisor (supervision_id, supervisor_id, priority, username)
SELECT ss.id, sr.id, 2, 'USER2'
FROM supervision_supervisor ss CROSS JOIN (SELECT id FROM sillari.supervisor WHERE lastname = 'Varavalvoja') sr
WHERE ss.supervisor_id IS NOT NULL;
