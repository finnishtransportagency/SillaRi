--AXLE CHART
INSERT INTO sillari.axle_chart (id, permit_id) OVERRIDING SYSTEM VALUE VALUES (1, 1);
INSERT INTO sillari.axle_chart (id, permit_id) OVERRIDING SYSTEM VALUE VALUES (2, 2);
INSERT INTO sillari.axle_chart (id, permit_id) OVERRIDING SYSTEM VALUE VALUES (3, 3);
INSERT INTO sillari.axle_chart (id, permit_id) OVERRIDING SYSTEM VALUE VALUES (4, 4);

-- Overriding system value doesn't update the sequence
SELECT setval('sillari.axle_chart_id_seq', 4);

--AXLE
INSERT INTO sillari.axle (axle_chart_id, axle_number, weight, distance_to_next) VALUES (1, 1, 8, 4.5);
INSERT INTO sillari.axle (axle_chart_id, axle_number, weight, distance_to_next) VALUES (1, 2, 8.75, 1.5);
INSERT INTO sillari.axle (axle_chart_id, axle_number, weight, distance_to_next) VALUES (1, 3, 8.75, 0);

INSERT INTO sillari.axle (axle_chart_id, axle_number, weight, distance_to_next) VALUES (2, 1, 10, 3.5);
INSERT INTO sillari.axle (axle_chart_id, axle_number, weight, distance_to_next) VALUES (2, 2, 13, 1.3);
INSERT INTO sillari.axle (axle_chart_id, axle_number, weight, distance_to_next) VALUES (2, 3, 14, 9);
INSERT INTO sillari.axle (axle_chart_id, axle_number, weight, distance_to_next) VALUES (2, 4, 14, 1.3);
INSERT INTO sillari.axle (axle_chart_id, axle_number, weight, distance_to_next) VALUES (2, 5, 11, 0);

INSERT INTO sillari.axle (axle_chart_id, axle_number, weight, distance_to_next) VALUES (3, 1, 10, 2);
INSERT INTO sillari.axle (axle_chart_id, axle_number, weight, distance_to_next) VALUES (3, 2, 10, 2);
INSERT INTO sillari.axle (axle_chart_id, axle_number, weight, distance_to_next) VALUES (3, 3, 10, 4.1);
INSERT INTO sillari.axle (axle_chart_id, axle_number, weight, distance_to_next) VALUES (3, 4, 11, 1.36);
INSERT INTO sillari.axle (axle_chart_id, axle_number, weight, distance_to_next) VALUES (3, 5, 11, 1.36);
INSERT INTO sillari.axle (axle_chart_id, axle_number, weight, distance_to_next) VALUES (3, 6, 11, 1.36);
INSERT INTO sillari.axle (axle_chart_id, axle_number, weight, distance_to_next) VALUES (3, 7, 11, 0);

INSERT INTO sillari.axle (axle_chart_id, axle_number, weight, distance_to_next) VALUES (4, 1, 10, 2.85);
INSERT INTO sillari.axle (axle_chart_id, axle_number, weight, distance_to_next) VALUES (4, 2, 13, 1.45);
INSERT INTO sillari.axle (axle_chart_id, axle_number, weight, distance_to_next) VALUES (4, 3, 14, 1.37);
INSERT INTO sillari.axle (axle_chart_id, axle_number, weight, distance_to_next) VALUES (4, 4, 14, 2.93);
INSERT INTO sillari.axle (axle_chart_id, axle_number, weight, distance_to_next) VALUES (4, 5, 11, 1.36);
INSERT INTO sillari.axle (axle_chart_id, axle_number, weight, distance_to_next) VALUES (4, 6, 11, 1.36);
INSERT INTO sillari.axle (axle_chart_id, axle_number, weight, distance_to_next) VALUES (4, 7, 11.5, 13);
INSERT INTO sillari.axle (axle_chart_id, axle_number, weight, distance_to_next) VALUES (4, 8, 11.5, 1.36);
INSERT INTO sillari.axle (axle_chart_id, axle_number, weight, distance_to_next) VALUES (4, 9, 11.5, 1.36);
INSERT INTO sillari.axle (axle_chart_id, axle_number, weight, distance_to_next) VALUES (4, 10, 11.5, 1.36);
INSERT INTO sillari.axle (axle_chart_id, axle_number, weight, distance_to_next) VALUES (4, 11, 11.5, 1.36);
INSERT INTO sillari.axle (axle_chart_id, axle_number, weight, distance_to_next) VALUES (4, 12, 11.5, 0);
