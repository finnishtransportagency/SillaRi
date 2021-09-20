--VEHICLE
INSERT INTO sillari.vehicle
    (permit_id, "type", identifier)
SELECT p.id, 'TRUCK', 'ABC-963'
FROM sillari.permit p
WHERE permit_number = 'MV/176/2021';

INSERT INTO sillari.vehicle
    (permit_id, "type", identifier)
SELECT p.id, 'TRUCK', 'DEF-852'
FROM sillari.permit p
WHERE permit_number = 'MV/177/2021';

INSERT INTO sillari.vehicle
    (permit_id, "type", identifier)
SELECT p.id, 'TRUCK', 'GHI-741'
FROM sillari.permit p
WHERE permit_number = '149/2021';

INSERT INTO sillari.vehicle
    (permit_id, "type", identifier)
SELECT p.id, 'SEMITRAILER', 'JKL-630'
FROM sillari.permit p
WHERE permit_number = '149/2021';

INSERT INTO sillari.vehicle
    (permit_id, "type", identifier)
SELECT p.id, 'TRUCK', 'MNO-529'
FROM sillari.permit p
WHERE permit_number = '150/2021';

INSERT INTO sillari.vehicle
    (permit_id, "type", identifier)
SELECT p.id, 'TRAILER', 'PQR-418'
FROM sillari.permit p
WHERE permit_number = '150/2021';

--TRANSPORT_DIMENSIONS
INSERT INTO sillari.transport_dimensions
    (permit_id, height, width, length)
SELECT p.id, 4.4, 2.5, 7.5
FROM sillari.permit p
WHERE permit_number = 'MV/176/2021';

INSERT INTO sillari.transport_dimensions
    (permit_id, height, width, length)
SELECT p.id, 4.2, 2.7, 16.5
FROM sillari.permit p
WHERE permit_number = 'MV/177/2021';

INSERT INTO sillari.transport_dimensions
    (permit_id, height, width, length)
SELECT p.id, 2.9, 3.0, 13.5
FROM sillari.permit p
WHERE permit_number = '149/2021';

INSERT INTO sillari.transport_dimensions
    (permit_id, height, width, length)
SELECT p.id, 4.9, 4.5, 30.5
FROM sillari.permit p
WHERE permit_number = '150/2021';

--UNLOADED_TRANSPORT_DIMENSIONS
INSERT INTO sillari.unloaded_transport_dimensions
    (permit_id, height, width, length)
SELECT p.id, 4.2, 2.5, 7.5
FROM sillari.permit p
WHERE permit_number = 'MV/176/2021';;

INSERT INTO sillari.unloaded_transport_dimensions
    (permit_id, height, width, length)
SELECT p.id, 4.2, 2.5, 16
FROM sillari.permit p
WHERE permit_number = 'MV/177/2021';

INSERT INTO sillari.unloaded_transport_dimensions
    (permit_id, height, width, length)
SELECT p.id, 2.9, 2.6, 12.5
FROM sillari.permit p
WHERE permit_number = '149/2021';

INSERT INTO sillari.unloaded_transport_dimensions
    (permit_id, height, width, length)
SELECT p.id, 4.2, 2.6, 30.5
FROM sillari.permit p
WHERE permit_number = '150/2021';
