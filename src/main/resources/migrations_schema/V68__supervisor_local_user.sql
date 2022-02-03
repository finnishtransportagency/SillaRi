INSERT INTO sillari.supervisor (firstname, lastname, username) VALUES ('CGI-Local', 'Testikäyttäjä', 'T012345');

UPDATE sillari.supervision_supervisor ss SET supervisor_id = (SELECT s.id from sillari.supervisor s WHERE s.username = 'T012345') WHERE ss.username = 'USER1';
UPDATE sillari.supervision_supervisor ss SET username = 'T012345' WHERE ss.username = 'USER1';
