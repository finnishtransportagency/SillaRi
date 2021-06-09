--Update sequences where test data has not used sequence for id
SELECT setval('sillari.authorization_id_seq', (SELECT MAX(id) FROM sillari.permit), true);
SELECT setval('sillari.company_id_seq', (SELECT MAX(id) FROM sillari.company), true);
SELECT setval('sillari.route_id_seq', (SELECT MAX(id) FROM sillari.route), true);

--Supervision status was using supervision seq
ALTER TABLE sillari.supervision_status ALTER COLUMN id SET DEFAULT nextval('sillari.supervision_status_id_seq');
SELECT setval('sillari.supervision_status_id_seq', (SELECT MAX(id) FROM sillari.supervision_status), true);
