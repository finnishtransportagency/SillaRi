INSERT INTO sillari.route_transport (id, route_id, planned_departure_time) OVERRIDING SYSTEM VALUE VALUES (1, 1, null);
INSERT INTO sillari.route_transport (id, route_id, planned_departure_time) OVERRIDING SYSTEM VALUE VALUES (2, 2, null);
INSERT INTO sillari.route_transport (id, route_id, planned_departure_time) OVERRIDING SYSTEM VALUE VALUES (3, 3, null);
INSERT INTO sillari.route_transport (id, route_id, planned_departure_time) OVERRIDING SYSTEM VALUE VALUES (4, 4, null);

-- Overriding system value doesn't update the sequence
SELECT setval('sillari.route_transport_id_seq', 4);
