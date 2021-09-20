--VEHICLE
-- Reset sequence
SELECT setval('sillari.vehicle_id_seq', 1, false);

INSERT INTO sillari.vehicle (permit_id, "type", identifier) VALUES (1, 'TRUCK', 'ABC-963');
INSERT INTO sillari.vehicle (permit_id, "type", identifier) VALUES (2, 'TRUCK', 'DEF-852');
INSERT INTO sillari.vehicle (permit_id, "type", identifier) VALUES (3, 'TRUCK', 'GHI-741');
INSERT INTO sillari.vehicle (permit_id, "type", identifier) VALUES (3, 'SEMITRAILER', 'JKL-630');
INSERT INTO sillari.vehicle (permit_id, "type", identifier) VALUES (4, 'TRUCK', 'MNO-529');
INSERT INTO sillari.vehicle (permit_id, "type", identifier) VALUES (4, 'TRAILER', 'PQR-418');

--TRANSPORT_DIMENSIONS
-- Reset sequence
SELECT setval('sillari.transport_dimensions_id_seq', 1, false);

INSERT INTO sillari.transport_dimensions (permit_id, height, width, length) VALUES (1, 4.4, 2.5, 7.5);
INSERT INTO sillari.transport_dimensions (permit_id, height, width, length) VALUES (2, 4.2, 2.7, 16.5);
INSERT INTO sillari.transport_dimensions (permit_id, height, width, length) VALUES (3, 2.9, 3.0, 13.5);
INSERT INTO sillari.transport_dimensions (permit_id, height, width, length) VALUES (4, 4.9, 4.5, 30.5);

--UNLOADED_TRANSPORT_DIMENSIONS
-- Reset sequence
SELECT setval('sillari.unloaded_transport_dimensions_id_seq', 1, false);

INSERT INTO sillari.unloaded_transport_dimensions (permit_id, height, width, length) VALUES (1, 4.2, 2.5, 7.5);
INSERT INTO sillari.unloaded_transport_dimensions (permit_id, height, width, length) VALUES (2, 4.2, 2.5, 16);
INSERT INTO sillari.unloaded_transport_dimensions (permit_id, height, width, length) VALUES (3, 2.9, 2.6, 12.5);
INSERT INTO sillari.unloaded_transport_dimensions (permit_id, height, width, length) VALUES (4, 4.2, 2.6, 30.5);
