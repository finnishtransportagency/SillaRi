SELECT nextval('address_id_seq') AS id
INTO address_seq_1;
SELECT nextval('address_id_seq') AS id
INTO address_seq_2;
SELECT nextval('address_id_seq') AS id
INTO address_seq_3;
SELECT nextval('address_id_seq') AS id
INTO address_seq_4;
SELECT nextval('permit_id_seq') AS id
INTO permit_seq_1;
SELECT nextval('axle_chart_id_seq') AS id
INTO axle_chart_seq_1;
SELECT nextval('route_id_seq') AS id
INTO route_seq_1;
SELECT nextval('route_id_seq') AS id
INTO route_seq_2;

INSERT INTO sillari.company ("name", business_id) VALUES ('Havator', '2083639-0') ON CONFLICT DO NOTHING ;

SELECT id INTO company_seq FROM sillari.company WHERE business_id='2083639-0';

INSERT INTO sillari.address (id, streetaddress, row_created_time, row_updated_time)
VALUES ((SELECT id from address_seq_1 LIMIT 1), 'Järvikatu, Vaasa', '2022-04-12 12:45:47.507337 +00:00', null);
INSERT INTO sillari.address (id, streetaddress, row_created_time, row_updated_time)
VALUES ((SELECT id from address_seq_2 LIMIT 1), 'Merisatamantie, Pori', '2022-04-12 12:45:47.507337 +00:00', null);

INSERT INTO sillari.permit (id, company_id, permit_number, transport_total_mass, lelu_version, additional_details,
                            lelu_last_modified_date, valid_start_date, valid_end_date, pdf_object_key, row_created_time,
                            row_updated_time)
VALUES ((SELECT id from permit_seq_1 LIMIT 1), (SELECT id from company_seq LIMIT 1),
        'CGI_Havator_test_permit', 137, 3, null, '2022-03-21 13:22:57.000000 +00:00',
        '2022-03-16 08:00:00.000000 +00:00',
        '2022-12-31 23:59:59.000000 +00:00', null, '2022-04-12 12:45:47.507337 +00:00', null);

INSERT INTO sillari.axle_chart (id, permit_id, row_created_time, row_updated_time)
VALUES ((SELECT id from axle_chart_seq_1 LIMIT 1), (SELECT id from permit_seq_1 LIMIT 1),
        '2022-04-12 12:45:47.507337 +00:00', null);

INSERT INTO sillari.transport_dimensions (permit_id, height, width, length, row_created_time, row_updated_time)
VALUES ((SELECT id from permit_seq_1 LIMIT 1), 2, 2, 10, '2022-04-12 12:45:47.507337 +00:00', null);

INSERT INTO sillari.route (id, permit_id, name, departure_address_id, arrival_address_id, geom, lelu_id,
                           transport_count, alternative_route, row_created_time, row_updated_time)
VALUES ((SELECT id from route_seq_1 LIMIT 1), (SELECT id from permit_seq_1 LIMIT 1), '1. Vaasa - Pori',
        (SELECT id from address_seq_1 LIMIT 1), (SELECT id from address_seq_2 LIMIT 1), null, 20307, 16, false,
        '2022-04-12 12:45:47.507337 +00:00', null);

INSERT INTO sillari.vehicle (permit_id, type, identifier, ordinal, role, row_created_time, row_updated_time)
VALUES ((SELECT id from permit_seq_1 LIMIT 1), 'Kuorma-auto', 'aab-222', 1, 'PUSHING_VEHICLE',
        '2022-04-12 12:45:47.507337 +00:00', null);
INSERT INTO sillari.vehicle (permit_id, type, identifier, ordinal, role, row_created_time, row_updated_time)
VALUES ((SELECT id from permit_seq_1 LIMIT 1), 'Puoliperävaunu', 'per-123', 2, 'TRAILER',
        '2022-04-12 12:45:47.507337 +00:00', null);
INSERT INTO sillari.vehicle (permit_id, type, identifier, ordinal, role, row_created_time, row_updated_time)
VALUES ((SELECT id from permit_seq_1 LIMIT 1), 'Kuorma-auto', 'kuo-123', 3, 'TRUCK',
        '2022-04-12 12:45:47.507337 +00:00', null);


INSERT INTO sillari.axle (axle_number, weight, distance_to_next, max_distance_to_next, axle_chart_id, row_created_time,
                          row_updated_time)
VALUES (1, 25, 2.5, null, (SELECT id from axle_chart_seq_1 LIMIT 1), '2022-04-12 12:45:47.507337 +00:00', null);
INSERT INTO sillari.axle (axle_number, weight, distance_to_next, max_distance_to_next, axle_chart_id, row_created_time,
                          row_updated_time)
VALUES (2, 25, 1, 2, (SELECT id from axle_chart_seq_1 LIMIT 1), '2022-04-12 12:45:47.507337 +00:00', null);
INSERT INTO sillari.axle (axle_number, weight, distance_to_next, max_distance_to_next, axle_chart_id, row_created_time,
                          row_updated_time)
VALUES (3, 17, 1.5, null, (SELECT id from axle_chart_seq_1 LIMIT 1), '2022-04-12 12:45:47.507337 +00:00', null);
INSERT INTO sillari.axle (axle_number, weight, distance_to_next, max_distance_to_next, axle_chart_id, row_created_time,
                          row_updated_time)
VALUES (4, 17, 1.5, null, (SELECT id from axle_chart_seq_1 LIMIT 1), '2022-04-12 12:45:47.507337 +00:00', null);
INSERT INTO sillari.axle (axle_number, weight, distance_to_next, max_distance_to_next, axle_chart_id, row_created_time,
                          row_updated_time)
VALUES (5, 17, 1, 2, (SELECT id from axle_chart_seq_1 LIMIT 1), '2022-04-12 12:45:47.507337 +00:00', null);
INSERT INTO sillari.axle (axle_number, weight, distance_to_next, max_distance_to_next, axle_chart_id, row_created_time,
                          row_updated_time)
VALUES (6, 9, 1.5, null, (SELECT id from axle_chart_seq_1 LIMIT 1), '2022-04-12 12:45:47.507337 +00:00', null);
INSERT INTO sillari.axle (axle_number, weight, distance_to_next, max_distance_to_next, axle_chart_id, row_created_time,
                          row_updated_time)
VALUES (7, 9, 1.5, null, (SELECT id from axle_chart_seq_1 LIMIT 1), '2022-04-12 12:45:47.507337 +00:00', null);
INSERT INTO sillari.axle (axle_number, weight, distance_to_next, max_distance_to_next, axle_chart_id, row_created_time,
                          row_updated_time)
VALUES (8, 9, 1.5, null, (SELECT id from axle_chart_seq_1 LIMIT 1), '2022-04-12 12:45:47.507337 +00:00', null);
INSERT INTO sillari.axle (axle_number, weight, distance_to_next, max_distance_to_next, axle_chart_id, row_created_time,
                          row_updated_time)
VALUES (9, 9, 0, null, (SELECT id from axle_chart_seq_1 LIMIT 1), '2022-04-12 12:45:47.507337 +00:00', null);

INSERT INTO sillari.route_bridge (route_id, bridge_id, crossing_instruction, contract_number, ordinal, row_created_time,
                                  row_updated_time, contract_business_id, transport_number)
VALUES ((SELECT id from route_seq_1 LIMIT 1), (select b.id from sillari.bridge b where b.identifier = 'V-1732'), null,
        1064, 1, '2022-04-12 12:45:47.507337 +00:00', null, null, 2);
INSERT INTO sillari.route_bridge (route_id, bridge_id, crossing_instruction, contract_number, ordinal, row_created_time,
                                  row_updated_time, contract_business_id, transport_number)
VALUES ((SELECT id from route_seq_1 LIMIT 1), (select b.id from sillari.bridge b where b.identifier = 'T-1957'), null,
        241, 2, '2022-04-12 12:45:47.507337 +00:00', null, null, 2);
INSERT INTO sillari.route_bridge (route_id, bridge_id, crossing_instruction, contract_number, ordinal, row_created_time,
                                  row_updated_time, contract_business_id, transport_number)
VALUES ((SELECT id from route_seq_1 LIMIT 1), (select b.id from sillari.bridge b where b.identifier = 'T-848'), null,
        236, 3, '2022-04-12 12:45:47.507337 +00:00', null, null, 2);
INSERT INTO sillari.route_bridge (route_id, bridge_id, crossing_instruction, contract_number, ordinal, row_created_time,
                                  row_updated_time, contract_business_id, transport_number)
VALUES ((SELECT id from route_seq_1 LIMIT 1), (select b.id from sillari.bridge b where b.identifier = 'T-1958'), null,
        241, 4, '2022-04-12 12:45:47.507337 +00:00', null, null, 2);
INSERT INTO sillari.route_bridge (route_id, bridge_id, crossing_instruction, contract_number, ordinal, row_created_time,
                                  row_updated_time, contract_business_id, transport_number)
VALUES ((SELECT id from route_seq_1 LIMIT 1), (select b.id from sillari.bridge b where b.identifier = 'T-848'), null,
        236, 5, '2022-04-12 12:45:47.507337 +00:00', null, null, 2);
INSERT INTO sillari.route_bridge (route_id, bridge_id, crossing_instruction, contract_number, ordinal, row_created_time,
                                  row_updated_time, contract_business_id, transport_number)
VALUES ((SELECT id from route_seq_1 LIMIT 1), (select b.id from sillari.bridge b where b.identifier = 'T-1963'), null,
        241, 6, '2022-04-12 12:45:47.507337 +00:00', null, null, 2);
INSERT INTO sillari.route_bridge (route_id, bridge_id, crossing_instruction, contract_number, ordinal, row_created_time,
                                  row_updated_time, contract_business_id, transport_number)
VALUES ((SELECT id from route_seq_1 LIMIT 1), (select b.id from sillari.bridge b where b.identifier = 'T-1094'), null,
        236, 7, '2022-04-12 12:45:47.507337 +00:00', null, null, 2);
INSERT INTO sillari.route_bridge (route_id, bridge_id, crossing_instruction, contract_number, ordinal, row_created_time,
                                  row_updated_time, contract_business_id, transport_number)
VALUES ((SELECT id from route_seq_1 LIMIT 1), (select b.id from sillari.bridge b where b.identifier = 'T-1095'), null,
        236, 8, '2022-04-12 12:45:47.507337 +00:00', null, null, 2);
INSERT INTO sillari.route_bridge (route_id, bridge_id, crossing_instruction, contract_number, ordinal, row_created_time,
                                  row_updated_time, contract_business_id, transport_number)
VALUES ((SELECT id from route_seq_1 LIMIT 1), (select b.id from sillari.bridge b where b.identifier = 'V-5575'), null,
        1066, 9, '2022-04-12 12:45:47.507337 +00:00', null, null, 2);
INSERT INTO sillari.route_bridge (route_id, bridge_id, crossing_instruction, contract_number, ordinal, row_created_time,
                                  row_updated_time, contract_business_id, transport_number)
VALUES ((SELECT id from route_seq_1 LIMIT 1), (select b.id from sillari.bridge b where b.identifier = 'T-1094'), null,
        236, 10, '2022-04-12 12:45:47.507337 +00:00', null, null, 2);
INSERT INTO sillari.route_bridge (route_id, bridge_id, crossing_instruction, contract_number, ordinal, row_created_time,
                                  row_updated_time, contract_business_id, transport_number)
VALUES ((SELECT id from route_seq_1 LIMIT 1), (select b.id from sillari.bridge b where b.identifier = 'T-1958'), null,
        241, 11, '2022-04-12 12:45:47.507337 +00:00', null, null, 2);
INSERT INTO sillari.route_bridge (route_id, bridge_id, crossing_instruction, contract_number, ordinal, row_created_time,
                                  row_updated_time, contract_business_id, transport_number)
VALUES ((SELECT id from route_seq_1 LIMIT 1), (select b.id from sillari.bridge b where b.identifier = 'T-1531'), null,
        236, 12, '2022-04-12 12:45:47.507337 +00:00', null, null, 2);
INSERT INTO sillari.route_bridge (route_id, bridge_id, crossing_instruction, contract_number, ordinal, row_created_time,
                                  row_updated_time, contract_business_id, transport_number)
VALUES ((SELECT id from route_seq_1 LIMIT 1), (select b.id from sillari.bridge b where b.identifier = 'V-326'), null,
        1064, 13, '2022-04-12 12:45:47.507337 +00:00', null, null, 2);
INSERT INTO sillari.route_bridge (route_id, bridge_id, crossing_instruction, contract_number, ordinal, row_created_time,
                                  row_updated_time, contract_business_id, transport_number)
VALUES ((SELECT id from route_seq_1 LIMIT 1), (select b.id from sillari.bridge b where b.identifier = 'T-1531'), null,
        236, 14, '2022-04-12 12:45:47.507337 +00:00', null, null, 2);
INSERT INTO sillari.route_bridge (route_id, bridge_id, crossing_instruction, contract_number, ordinal, row_created_time,
                                  row_updated_time, contract_business_id, transport_number)
VALUES ((SELECT id from route_seq_1 LIMIT 1), (select b.id from sillari.bridge b where b.identifier = 'V-1732'), null,
        1064, 1, '2022-04-12 12:45:47.507337 +00:00', null, null, 3);
INSERT INTO sillari.route_bridge (route_id, bridge_id, crossing_instruction, contract_number, ordinal, row_created_time,
                                  row_updated_time, contract_business_id, transport_number)
VALUES ((SELECT id from route_seq_1 LIMIT 1), (select b.id from sillari.bridge b where b.identifier = 'T-1957'), null,
        241, 2, '2022-04-12 12:45:47.507337 +00:00', null, null, 3);
INSERT INTO sillari.route_bridge (route_id, bridge_id, crossing_instruction, contract_number, ordinal, row_created_time,
                                  row_updated_time, contract_business_id, transport_number)
VALUES ((SELECT id from route_seq_1 LIMIT 1), (select b.id from sillari.bridge b where b.identifier = 'T-848'), null,
        236, 3, '2022-04-12 12:45:47.507337 +00:00', null, null, 3);
INSERT INTO sillari.route_bridge (route_id, bridge_id, crossing_instruction, contract_number, ordinal, row_created_time,
                                  row_updated_time, contract_business_id, transport_number)
VALUES ((SELECT id from route_seq_1 LIMIT 1), (select b.id from sillari.bridge b where b.identifier = 'T-1958'), null,
        241, 4, '2022-04-12 12:45:47.507337 +00:00', null, null, 3);
INSERT INTO sillari.route_bridge (route_id, bridge_id, crossing_instruction, contract_number, ordinal, row_created_time,
                                  row_updated_time, contract_business_id, transport_number)
VALUES ((SELECT id from route_seq_1 LIMIT 1), (select b.id from sillari.bridge b where b.identifier = 'T-848'), null,
        236, 5, '2022-04-12 12:45:47.507337 +00:00', null, null, 3);
INSERT INTO sillari.route_bridge (route_id, bridge_id, crossing_instruction, contract_number, ordinal, row_created_time,
                                  row_updated_time, contract_business_id, transport_number)
VALUES ((SELECT id from route_seq_1 LIMIT 1), (select b.id from sillari.bridge b where b.identifier = 'T-1963'), null,
        241, 6, '2022-04-12 12:45:47.507337 +00:00', null, null, 3);
INSERT INTO sillari.route_bridge (route_id, bridge_id, crossing_instruction, contract_number, ordinal, row_created_time,
                                  row_updated_time, contract_business_id, transport_number)
VALUES ((SELECT id from route_seq_1 LIMIT 1), (select b.id from sillari.bridge b where b.identifier = 'T-1094'), null,
        236, 7, '2022-04-12 12:45:47.507337 +00:00', null, null, 3);
INSERT INTO sillari.route_bridge (route_id, bridge_id, crossing_instruction, contract_number, ordinal, row_created_time,
                                  row_updated_time, contract_business_id, transport_number)
VALUES ((SELECT id from route_seq_1 LIMIT 1), (select b.id from sillari.bridge b where b.identifier = 'T-1095'), null,
        236, 8, '2022-04-12 12:45:47.507337 +00:00', null, null, 3);
INSERT INTO sillari.route_bridge (route_id, bridge_id, crossing_instruction, contract_number, ordinal, row_created_time,
                                  row_updated_time, contract_business_id, transport_number)
VALUES ((SELECT id from route_seq_1 LIMIT 1), (select b.id from sillari.bridge b where b.identifier = 'V-5575'), null,
        1066, 9, '2022-04-12 12:45:47.507337 +00:00', null, null, 3);
INSERT INTO sillari.route_bridge (route_id, bridge_id, crossing_instruction, contract_number, ordinal, row_created_time,
                                  row_updated_time, contract_business_id, transport_number)
VALUES ((SELECT id from route_seq_1 LIMIT 1), (select b.id from sillari.bridge b where b.identifier = 'T-1094'), null,
        236, 10, '2022-04-12 12:45:47.507337 +00:00', null, null, 3);
INSERT INTO sillari.route_bridge (route_id, bridge_id, crossing_instruction, contract_number, ordinal, row_created_time,
                                  row_updated_time, contract_business_id, transport_number)
VALUES ((SELECT id from route_seq_1 LIMIT 1), (select b.id from sillari.bridge b where b.identifier = 'T-1958'), null,
        241, 11, '2022-04-12 12:45:47.507337 +00:00', null, null, 3);
INSERT INTO sillari.route_bridge (route_id, bridge_id, crossing_instruction, contract_number, ordinal, row_created_time,
                                  row_updated_time, contract_business_id, transport_number)
VALUES ((SELECT id from route_seq_1 LIMIT 1), (select b.id from sillari.bridge b where b.identifier = 'T-1531'), null,
        236, 12, '2022-04-12 12:45:47.507337 +00:00', null, null, 3);
INSERT INTO sillari.route_bridge (route_id, bridge_id, crossing_instruction, contract_number, ordinal, row_created_time,
                                  row_updated_time, contract_business_id, transport_number)
VALUES ((SELECT id from route_seq_1 LIMIT 1), (select b.id from sillari.bridge b where b.identifier = 'V-326'), null,
        1064, 13, '2022-04-12 12:45:47.507337 +00:00', null, null, 3);
INSERT INTO sillari.route_bridge (route_id, bridge_id, crossing_instruction, contract_number, ordinal, row_created_time,
                                  row_updated_time, contract_business_id, transport_number)
VALUES ((SELECT id from route_seq_1 LIMIT 1), (select b.id from sillari.bridge b where b.identifier = 'T-1531'), null,
        236, 14, '2022-04-12 12:45:47.507337 +00:00', null, null, 3);
INSERT INTO sillari.route_bridge (route_id, bridge_id, crossing_instruction, contract_number, ordinal, row_created_time,
                                  row_updated_time, contract_business_id, transport_number)
VALUES ((SELECT id from route_seq_1 LIMIT 1), (select b.id from sillari.bridge b where b.identifier = 'V-1732'), null,
        1064, 1, '2022-04-12 12:45:47.507337 +00:00', null, null, 4);
INSERT INTO sillari.route_bridge (route_id, bridge_id, crossing_instruction, contract_number, ordinal, row_created_time,
                                  row_updated_time, contract_business_id, transport_number)
VALUES ((SELECT id from route_seq_1 LIMIT 1), (select b.id from sillari.bridge b where b.identifier = 'T-1957'), null,
        241, 2, '2022-04-12 12:45:47.507337 +00:00', null, null, 4);
INSERT INTO sillari.route_bridge (route_id, bridge_id, crossing_instruction, contract_number, ordinal, row_created_time,
                                  row_updated_time, contract_business_id, transport_number)
VALUES ((SELECT id from route_seq_1 LIMIT 1), (select b.id from sillari.bridge b where b.identifier = 'T-848'), null,
        236, 3, '2022-04-12 12:45:47.507337 +00:00', null, null, 4);
INSERT INTO sillari.route_bridge (route_id, bridge_id, crossing_instruction, contract_number, ordinal, row_created_time,
                                  row_updated_time, contract_business_id, transport_number)
VALUES ((SELECT id from route_seq_1 LIMIT 1), (select b.id from sillari.bridge b where b.identifier = 'T-1958'), null,
        241, 4, '2022-04-12 12:45:47.507337 +00:00', null, null, 4);
INSERT INTO sillari.route_bridge (route_id, bridge_id, crossing_instruction, contract_number, ordinal, row_created_time,
                                  row_updated_time, contract_business_id, transport_number)
VALUES ((SELECT id from route_seq_1 LIMIT 1), (select b.id from sillari.bridge b where b.identifier = 'T-848'), null,
        236, 5, '2022-04-12 12:45:47.507337 +00:00', null, null, 4);
INSERT INTO sillari.route_bridge (route_id, bridge_id, crossing_instruction, contract_number, ordinal, row_created_time,
                                  row_updated_time, contract_business_id, transport_number)
VALUES ((SELECT id from route_seq_1 LIMIT 1), (select b.id from sillari.bridge b where b.identifier = 'T-1963'), null,
        241, 6, '2022-04-12 12:45:47.507337 +00:00', null, null, 4);
INSERT INTO sillari.route_bridge (route_id, bridge_id, crossing_instruction, contract_number, ordinal, row_created_time,
                                  row_updated_time, contract_business_id, transport_number)
VALUES ((SELECT id from route_seq_1 LIMIT 1), (select b.id from sillari.bridge b where b.identifier = 'T-1094'), null,
        236, 7, '2022-04-12 12:45:47.507337 +00:00', null, null, 4);
INSERT INTO sillari.route_bridge (route_id, bridge_id, crossing_instruction, contract_number, ordinal, row_created_time,
                                  row_updated_time, contract_business_id, transport_number)
VALUES ((SELECT id from route_seq_1 LIMIT 1), (select b.id from sillari.bridge b where b.identifier = 'T-1095'), null,
        236, 8, '2022-04-12 12:45:47.507337 +00:00', null, null, 4);
INSERT INTO sillari.route_bridge (route_id, bridge_id, crossing_instruction, contract_number, ordinal, row_created_time,
                                  row_updated_time, contract_business_id, transport_number)
VALUES ((SELECT id from route_seq_1 LIMIT 1), (select b.id from sillari.bridge b where b.identifier = 'V-5575'), null,
        1066, 9, '2022-04-12 12:45:47.507337 +00:00', null, null, 4);
INSERT INTO sillari.route_bridge (route_id, bridge_id, crossing_instruction, contract_number, ordinal, row_created_time,
                                  row_updated_time, contract_business_id, transport_number)
VALUES ((SELECT id from route_seq_1 LIMIT 1), (select b.id from sillari.bridge b where b.identifier = 'T-1094'), null,
        236, 10, '2022-04-12 12:45:47.507337 +00:00', null, null, 4);
INSERT INTO sillari.route_bridge (route_id, bridge_id, crossing_instruction, contract_number, ordinal, row_created_time,
                                  row_updated_time, contract_business_id, transport_number)
VALUES ((SELECT id from route_seq_1 LIMIT 1), (select b.id from sillari.bridge b where b.identifier = 'T-1958'), null,
        241, 11, '2022-04-12 12:45:47.507337 +00:00', null, null, 4);
INSERT INTO sillari.route_bridge (route_id, bridge_id, crossing_instruction, contract_number, ordinal, row_created_time,
                                  row_updated_time, contract_business_id, transport_number)
VALUES ((SELECT id from route_seq_1 LIMIT 1), (select b.id from sillari.bridge b where b.identifier = 'T-1531'), null,
        236, 12, '2022-04-12 12:45:47.507337 +00:00', null, null, 4);
INSERT INTO sillari.route_bridge (route_id, bridge_id, crossing_instruction, contract_number, ordinal, row_created_time,
                                  row_updated_time, contract_business_id, transport_number)
VALUES ((SELECT id from route_seq_1 LIMIT 1), (select b.id from sillari.bridge b where b.identifier = 'V-326'), null,
        1064, 13, '2022-04-12 12:45:47.507337 +00:00', null, null, 4);
INSERT INTO sillari.route_bridge (route_id, bridge_id, crossing_instruction, contract_number, ordinal, row_created_time,
                                  row_updated_time, contract_business_id, transport_number)
VALUES ((SELECT id from route_seq_1 LIMIT 1), (select b.id from sillari.bridge b where b.identifier = 'T-1531'), null,
        236, 14, '2022-04-12 12:45:47.507337 +00:00', null, null, 4);
INSERT INTO sillari.route_bridge (route_id, bridge_id, crossing_instruction, contract_number, ordinal, row_created_time,
                                  row_updated_time, contract_business_id, transport_number)
VALUES ((SELECT id from route_seq_1 LIMIT 1), (select b.id from sillari.bridge b where b.identifier = 'V-1732'), null,
        1064, 1, '2022-04-12 12:45:47.507337 +00:00', null, null, 5);
INSERT INTO sillari.route_bridge (route_id, bridge_id, crossing_instruction, contract_number, ordinal, row_created_time,
                                  row_updated_time, contract_business_id, transport_number)
VALUES ((SELECT id from route_seq_1 LIMIT 1), (select b.id from sillari.bridge b where b.identifier = 'T-1957'), null,
        241, 2, '2022-04-12 12:45:47.507337 +00:00', null, null, 5);
INSERT INTO sillari.route_bridge (route_id, bridge_id, crossing_instruction, contract_number, ordinal, row_created_time,
                                  row_updated_time, contract_business_id, transport_number)
VALUES ((SELECT id from route_seq_1 LIMIT 1), (select b.id from sillari.bridge b where b.identifier = 'T-848'), null,
        236, 3, '2022-04-12 12:45:47.507337 +00:00', null, null, 5);
INSERT INTO sillari.route_bridge (route_id, bridge_id, crossing_instruction, contract_number, ordinal, row_created_time,
                                  row_updated_time, contract_business_id, transport_number)
VALUES ((SELECT id from route_seq_1 LIMIT 1), (select b.id from sillari.bridge b where b.identifier = 'T-1958'), null,
        241, 4, '2022-04-12 12:45:47.507337 +00:00', null, null, 5);
INSERT INTO sillari.route_bridge (route_id, bridge_id, crossing_instruction, contract_number, ordinal, row_created_time,
                                  row_updated_time, contract_business_id, transport_number)
VALUES ((SELECT id from route_seq_1 LIMIT 1), (select b.id from sillari.bridge b where b.identifier = 'T-848'), null,
        236, 5, '2022-04-12 12:45:47.507337 +00:00', null, null, 5);
INSERT INTO sillari.route_bridge (route_id, bridge_id, crossing_instruction, contract_number, ordinal, row_created_time,
                                  row_updated_time, contract_business_id, transport_number)
VALUES ((SELECT id from route_seq_1 LIMIT 1), (select b.id from sillari.bridge b where b.identifier = 'T-1963'), null,
        241, 6, '2022-04-12 12:45:47.507337 +00:00', null, null, 5);
INSERT INTO sillari.route_bridge (route_id, bridge_id, crossing_instruction, contract_number, ordinal, row_created_time,
                                  row_updated_time, contract_business_id, transport_number)
VALUES ((SELECT id from route_seq_1 LIMIT 1), (select b.id from sillari.bridge b where b.identifier = 'T-1094'), null,
        236, 7, '2022-04-12 12:45:47.507337 +00:00', null, null, 5);
INSERT INTO sillari.route_bridge (route_id, bridge_id, crossing_instruction, contract_number, ordinal, row_created_time,
                                  row_updated_time, contract_business_id, transport_number)
VALUES ((SELECT id from route_seq_1 LIMIT 1), (select b.id from sillari.bridge b where b.identifier = 'T-1095'), null,
        236, 8, '2022-04-12 12:45:47.507337 +00:00', null, null, 5);
INSERT INTO sillari.route_bridge (route_id, bridge_id, crossing_instruction, contract_number, ordinal, row_created_time,
                                  row_updated_time, contract_business_id, transport_number)
VALUES ((SELECT id from route_seq_1 LIMIT 1), (select b.id from sillari.bridge b where b.identifier = 'V-5575'), null,
        1066, 9, '2022-04-12 12:45:47.507337 +00:00', null, null, 5);
INSERT INTO sillari.route_bridge (route_id, bridge_id, crossing_instruction, contract_number, ordinal, row_created_time,
                                  row_updated_time, contract_business_id, transport_number)
VALUES ((SELECT id from route_seq_1 LIMIT 1), (select b.id from sillari.bridge b where b.identifier = 'T-1094'), null,
        236, 10, '2022-04-12 12:45:47.507337 +00:00', null, null, 5);
INSERT INTO sillari.route_bridge (route_id, bridge_id, crossing_instruction, contract_number, ordinal, row_created_time,
                                  row_updated_time, contract_business_id, transport_number)
VALUES ((SELECT id from route_seq_1 LIMIT 1), (select b.id from sillari.bridge b where b.identifier = 'T-1958'), null,
        241, 11, '2022-04-12 12:45:47.507337 +00:00', null, null, 5);
INSERT INTO sillari.route_bridge (route_id, bridge_id, crossing_instruction, contract_number, ordinal, row_created_time,
                                  row_updated_time, contract_business_id, transport_number)
VALUES ((SELECT id from route_seq_1 LIMIT 1), (select b.id from sillari.bridge b where b.identifier = 'T-1531'), null,
        236, 12, '2022-04-12 12:45:47.507337 +00:00', null, null, 5);
INSERT INTO sillari.route_bridge (route_id, bridge_id, crossing_instruction, contract_number, ordinal, row_created_time,
                                  row_updated_time, contract_business_id, transport_number)
VALUES ((SELECT id from route_seq_1 LIMIT 1), (select b.id from sillari.bridge b where b.identifier = 'V-326'), null,
        1064, 13, '2022-04-12 12:45:47.507337 +00:00', null, null, 5);
INSERT INTO sillari.route_bridge (route_id, bridge_id, crossing_instruction, contract_number, ordinal, row_created_time,
                                  row_updated_time, contract_business_id, transport_number)
VALUES ((SELECT id from route_seq_1 LIMIT 1), (select b.id from sillari.bridge b where b.identifier = 'T-1531'), null,
        236, 14, '2022-04-12 12:45:47.507337 +00:00', null, null, 5);
INSERT INTO sillari.route_bridge (route_id, bridge_id, crossing_instruction, contract_number, ordinal, row_created_time,
                                  row_updated_time, contract_business_id, transport_number)
VALUES ((SELECT id from route_seq_1 LIMIT 1), (select b.id from sillari.bridge b where b.identifier = 'V-1732'), null,
        1064, 1, '2022-04-12 12:45:47.507337 +00:00', null, null, 6);
INSERT INTO sillari.route_bridge (route_id, bridge_id, crossing_instruction, contract_number, ordinal, row_created_time,
                                  row_updated_time, contract_business_id, transport_number)
VALUES ((SELECT id from route_seq_1 LIMIT 1), (select b.id from sillari.bridge b where b.identifier = 'T-1957'), null,
        241, 2, '2022-04-12 12:45:47.507337 +00:00', null, null, 6);
INSERT INTO sillari.route_bridge (route_id, bridge_id, crossing_instruction, contract_number, ordinal, row_created_time,
                                  row_updated_time, contract_business_id, transport_number)
VALUES ((SELECT id from route_seq_1 LIMIT 1), (select b.id from sillari.bridge b where b.identifier = 'T-848'), null,
        236, 3, '2022-04-12 12:45:47.507337 +00:00', null, null, 6);
INSERT INTO sillari.route_bridge (route_id, bridge_id, crossing_instruction, contract_number, ordinal, row_created_time,
                                  row_updated_time, contract_business_id, transport_number)
VALUES ((SELECT id from route_seq_1 LIMIT 1), (select b.id from sillari.bridge b where b.identifier = 'T-1958'), null,
        241, 4, '2022-04-12 12:45:47.507337 +00:00', null, null, 6);
INSERT INTO sillari.route_bridge (route_id, bridge_id, crossing_instruction, contract_number, ordinal, row_created_time,
                                  row_updated_time, contract_business_id, transport_number)
VALUES ((SELECT id from route_seq_1 LIMIT 1), (select b.id from sillari.bridge b where b.identifier = 'T-848'), null,
        236, 5, '2022-04-12 12:45:47.507337 +00:00', null, null, 6);
INSERT INTO sillari.route_bridge (route_id, bridge_id, crossing_instruction, contract_number, ordinal, row_created_time,
                                  row_updated_time, contract_business_id, transport_number)
VALUES ((SELECT id from route_seq_1 LIMIT 1), (select b.id from sillari.bridge b where b.identifier = 'T-1963'), null,
        241, 6, '2022-04-12 12:45:47.507337 +00:00', null, null, 6);
INSERT INTO sillari.route_bridge (route_id, bridge_id, crossing_instruction, contract_number, ordinal, row_created_time,
                                  row_updated_time, contract_business_id, transport_number)
VALUES ((SELECT id from route_seq_1 LIMIT 1), (select b.id from sillari.bridge b where b.identifier = 'T-1094'), null,
        236, 7, '2022-04-12 12:45:47.507337 +00:00', null, null, 6);
INSERT INTO sillari.route_bridge (route_id, bridge_id, crossing_instruction, contract_number, ordinal, row_created_time,
                                  row_updated_time, contract_business_id, transport_number)
VALUES ((SELECT id from route_seq_1 LIMIT 1), (select b.id from sillari.bridge b where b.identifier = 'T-1095'), null,
        236, 8, '2022-04-12 12:45:47.507337 +00:00', null, null, 6);
INSERT INTO sillari.route_bridge (route_id, bridge_id, crossing_instruction, contract_number, ordinal, row_created_time,
                                  row_updated_time, contract_business_id, transport_number)
VALUES ((SELECT id from route_seq_1 LIMIT 1), (select b.id from sillari.bridge b where b.identifier = 'V-5575'), null,
        1066, 9, '2022-04-12 12:45:47.507337 +00:00', null, null, 6);
INSERT INTO sillari.route_bridge (route_id, bridge_id, crossing_instruction, contract_number, ordinal, row_created_time,
                                  row_updated_time, contract_business_id, transport_number)
VALUES ((SELECT id from route_seq_1 LIMIT 1), (select b.id from sillari.bridge b where b.identifier = 'T-1094'), null,
        236, 10, '2022-04-12 12:45:47.507337 +00:00', null, null, 6);
INSERT INTO sillari.route_bridge (route_id, bridge_id, crossing_instruction, contract_number, ordinal, row_created_time,
                                  row_updated_time, contract_business_id, transport_number)
VALUES ((SELECT id from route_seq_1 LIMIT 1), (select b.id from sillari.bridge b where b.identifier = 'T-1958'), null,
        241, 11, '2022-04-12 12:45:47.507337 +00:00', null, null, 6);
INSERT INTO sillari.route_bridge (route_id, bridge_id, crossing_instruction, contract_number, ordinal, row_created_time,
                                  row_updated_time, contract_business_id, transport_number)
VALUES ((SELECT id from route_seq_1 LIMIT 1), (select b.id from sillari.bridge b where b.identifier = 'T-1531'), null,
        236, 12, '2022-04-12 12:45:47.507337 +00:00', null, null, 6);
INSERT INTO sillari.route_bridge (route_id, bridge_id, crossing_instruction, contract_number, ordinal, row_created_time,
                                  row_updated_time, contract_business_id, transport_number)
VALUES ((SELECT id from route_seq_1 LIMIT 1), (select b.id from sillari.bridge b where b.identifier = 'V-326'), null,
        1064, 13, '2022-04-12 12:45:47.507337 +00:00', null, null, 6);
INSERT INTO sillari.route_bridge (route_id, bridge_id, crossing_instruction, contract_number, ordinal, row_created_time,
                                  row_updated_time, contract_business_id, transport_number)
VALUES ((SELECT id from route_seq_1 LIMIT 1), (select b.id from sillari.bridge b where b.identifier = 'T-1531'), null,
        236, 14, '2022-04-12 12:45:47.507337 +00:00', null, null, 6);
INSERT INTO sillari.route_bridge (route_id, bridge_id, crossing_instruction, contract_number, ordinal, row_created_time,
                                  row_updated_time, contract_business_id, transport_number)
VALUES ((SELECT id from route_seq_1 LIMIT 1), (select b.id from sillari.bridge b where b.identifier = 'V-1732'), null,
        1064, 1, '2022-04-12 12:45:47.507337 +00:00', null, null, 7);
INSERT INTO sillari.route_bridge (route_id, bridge_id, crossing_instruction, contract_number, ordinal, row_created_time,
                                  row_updated_time, contract_business_id, transport_number)
VALUES ((SELECT id from route_seq_1 LIMIT 1), (select b.id from sillari.bridge b where b.identifier = 'T-1957'), null,
        241, 2, '2022-04-12 12:45:47.507337 +00:00', null, null, 7);
INSERT INTO sillari.route_bridge (route_id, bridge_id, crossing_instruction, contract_number, ordinal, row_created_time,
                                  row_updated_time, contract_business_id, transport_number)
VALUES ((SELECT id from route_seq_1 LIMIT 1), (select b.id from sillari.bridge b where b.identifier = 'T-848'), null,
        236, 3, '2022-04-12 12:45:47.507337 +00:00', null, null, 7);
INSERT INTO sillari.route_bridge (route_id, bridge_id, crossing_instruction, contract_number, ordinal, row_created_time,
                                  row_updated_time, contract_business_id, transport_number)
VALUES ((SELECT id from route_seq_1 LIMIT 1), (select b.id from sillari.bridge b where b.identifier = 'T-1958'), null,
        241, 4, '2022-04-12 12:45:47.507337 +00:00', null, null, 7);
INSERT INTO sillari.route_bridge (route_id, bridge_id, crossing_instruction, contract_number, ordinal, row_created_time,
                                  row_updated_time, contract_business_id, transport_number)
VALUES ((SELECT id from route_seq_1 LIMIT 1), (select b.id from sillari.bridge b where b.identifier = 'T-848'), null,
        236, 5, '2022-04-12 12:45:47.507337 +00:00', null, null, 7);
INSERT INTO sillari.route_bridge (route_id, bridge_id, crossing_instruction, contract_number, ordinal, row_created_time,
                                  row_updated_time, contract_business_id, transport_number)
VALUES ((SELECT id from route_seq_1 LIMIT 1), (select b.id from sillari.bridge b where b.identifier = 'T-1963'), null,
        241, 6, '2022-04-12 12:45:47.507337 +00:00', null, null, 7);
INSERT INTO sillari.route_bridge (route_id, bridge_id, crossing_instruction, contract_number, ordinal, row_created_time,
                                  row_updated_time, contract_business_id, transport_number)
VALUES ((SELECT id from route_seq_1 LIMIT 1), (select b.id from sillari.bridge b where b.identifier = 'T-1094'), null,
        236, 7, '2022-04-12 12:45:47.507337 +00:00', null, null, 7);
INSERT INTO sillari.route_bridge (route_id, bridge_id, crossing_instruction, contract_number, ordinal, row_created_time,
                                  row_updated_time, contract_business_id, transport_number)
VALUES ((SELECT id from route_seq_1 LIMIT 1), (select b.id from sillari.bridge b where b.identifier = 'T-1095'), null,
        236, 8, '2022-04-12 12:45:47.507337 +00:00', null, null, 7);
INSERT INTO sillari.route_bridge (route_id, bridge_id, crossing_instruction, contract_number, ordinal, row_created_time,
                                  row_updated_time, contract_business_id, transport_number)
VALUES ((SELECT id from route_seq_1 LIMIT 1), (select b.id from sillari.bridge b where b.identifier = 'V-5575'), null,
        1066, 9, '2022-04-12 12:45:47.507337 +00:00', null, null, 7);
INSERT INTO sillari.route_bridge (route_id, bridge_id, crossing_instruction, contract_number, ordinal, row_created_time,
                                  row_updated_time, contract_business_id, transport_number)
VALUES ((SELECT id from route_seq_1 LIMIT 1), (select b.id from sillari.bridge b where b.identifier = 'T-1094'), null,
        236, 10, '2022-04-12 12:45:47.507337 +00:00', null, null, 7);
INSERT INTO sillari.route_bridge (route_id, bridge_id, crossing_instruction, contract_number, ordinal, row_created_time,
                                  row_updated_time, contract_business_id, transport_number)
VALUES ((SELECT id from route_seq_1 LIMIT 1), (select b.id from sillari.bridge b where b.identifier = 'T-1958'), null,
        241, 11, '2022-04-12 12:45:47.507337 +00:00', null, null, 7);
INSERT INTO sillari.route_bridge (route_id, bridge_id, crossing_instruction, contract_number, ordinal, row_created_time,
                                  row_updated_time, contract_business_id, transport_number)
VALUES ((SELECT id from route_seq_1 LIMIT 1), (select b.id from sillari.bridge b where b.identifier = 'T-1531'), null,
        236, 12, '2022-04-12 12:45:47.507337 +00:00', null, null, 7);
INSERT INTO sillari.route_bridge (route_id, bridge_id, crossing_instruction, contract_number, ordinal, row_created_time,
                                  row_updated_time, contract_business_id, transport_number)
VALUES ((SELECT id from route_seq_1 LIMIT 1), (select b.id from sillari.bridge b where b.identifier = 'V-326'), null,
        1064, 13, '2022-04-12 12:45:47.507337 +00:00', null, null, 7);
INSERT INTO sillari.route_bridge (route_id, bridge_id, crossing_instruction, contract_number, ordinal, row_created_time,
                                  row_updated_time, contract_business_id, transport_number)
VALUES ((SELECT id from route_seq_1 LIMIT 1), (select b.id from sillari.bridge b where b.identifier = 'V-1732'), null,
        1064, 1, '2022-04-12 12:45:47.507337 +00:00', null, null, 1);
INSERT INTO sillari.route_bridge (route_id, bridge_id, crossing_instruction, contract_number, ordinal, row_created_time,
                                  row_updated_time, contract_business_id, transport_number)
VALUES ((SELECT id from route_seq_1 LIMIT 1), (select b.id from sillari.bridge b where b.identifier = 'T-1957'), null,
        241, 2, '2022-04-12 12:45:47.507337 +00:00', null, null, 1);
INSERT INTO sillari.route_bridge (route_id, bridge_id, crossing_instruction, contract_number, ordinal, row_created_time,
                                  row_updated_time, contract_business_id, transport_number)
VALUES ((SELECT id from route_seq_1 LIMIT 1), (select b.id from sillari.bridge b where b.identifier = 'T-848'), null,
        236, 3, '2022-04-12 12:45:47.507337 +00:00', null, null, 1);
INSERT INTO sillari.route_bridge (route_id, bridge_id, crossing_instruction, contract_number, ordinal, row_created_time,
                                  row_updated_time, contract_business_id, transport_number)
VALUES ((SELECT id from route_seq_1 LIMIT 1), (select b.id from sillari.bridge b where b.identifier = 'T-1958'), null,
        241, 4, '2022-04-12 12:45:47.507337 +00:00', null, null, 1);
INSERT INTO sillari.route_bridge (route_id, bridge_id, crossing_instruction, contract_number, ordinal, row_created_time,
                                  row_updated_time, contract_business_id, transport_number)
VALUES ((SELECT id from route_seq_1 LIMIT 1), (select b.id from sillari.bridge b where b.identifier = 'T-848'), null,
        236, 5, '2022-04-12 12:45:47.507337 +00:00', null, null, 1);
INSERT INTO sillari.route_bridge (route_id, bridge_id, crossing_instruction, contract_number, ordinal, row_created_time,
                                  row_updated_time, contract_business_id, transport_number)
VALUES ((SELECT id from route_seq_1 LIMIT 1), (select b.id from sillari.bridge b where b.identifier = 'T-1963'), null,
        241, 6, '2022-04-12 12:45:47.507337 +00:00', null, null, 1);
INSERT INTO sillari.route_bridge (route_id, bridge_id, crossing_instruction, contract_number, ordinal, row_created_time,
                                  row_updated_time, contract_business_id, transport_number)
VALUES ((SELECT id from route_seq_1 LIMIT 1), (select b.id from sillari.bridge b where b.identifier = 'T-1094'), null,
        236, 7, '2022-04-12 12:45:47.507337 +00:00', null, null, 1);
INSERT INTO sillari.route_bridge (route_id, bridge_id, crossing_instruction, contract_number, ordinal, row_created_time,
                                  row_updated_time, contract_business_id, transport_number)
VALUES ((SELECT id from route_seq_1 LIMIT 1), (select b.id from sillari.bridge b where b.identifier = 'T-1095'), null,
        236, 8, '2022-04-12 12:45:47.507337 +00:00', null, null, 1);
INSERT INTO sillari.route_bridge (route_id, bridge_id, crossing_instruction, contract_number, ordinal, row_created_time,
                                  row_updated_time, contract_business_id, transport_number)
VALUES ((SELECT id from route_seq_1 LIMIT 1), (select b.id from sillari.bridge b where b.identifier = 'V-5575'), null,
        1066, 9, '2022-04-12 12:45:47.507337 +00:00', null, null, 1);
INSERT INTO sillari.route_bridge (route_id, bridge_id, crossing_instruction, contract_number, ordinal, row_created_time,
                                  row_updated_time, contract_business_id, transport_number)
VALUES ((SELECT id from route_seq_1 LIMIT 1), (select b.id from sillari.bridge b where b.identifier = 'T-1094'), null,
        236, 10, '2022-04-12 12:45:47.507337 +00:00', null, null, 1);
INSERT INTO sillari.route_bridge (route_id, bridge_id, crossing_instruction, contract_number, ordinal, row_created_time,
                                  row_updated_time, contract_business_id, transport_number)
VALUES ((SELECT id from route_seq_1 LIMIT 1), (select b.id from sillari.bridge b where b.identifier = 'T-1958'), null,
        241, 11, '2022-04-12 12:45:47.507337 +00:00', null, null, 1);
INSERT INTO sillari.route_bridge (route_id, bridge_id, crossing_instruction, contract_number, ordinal, row_created_time,
                                  row_updated_time, contract_business_id, transport_number)
VALUES ((SELECT id from route_seq_1 LIMIT 1), (select b.id from sillari.bridge b where b.identifier = 'T-1531'), null,
        236, 12, '2022-04-12 12:45:47.507337 +00:00', null, null, 1);
INSERT INTO sillari.route_bridge (route_id, bridge_id, crossing_instruction, contract_number, ordinal, row_created_time,
                                  row_updated_time, contract_business_id, transport_number)
VALUES ((SELECT id from route_seq_1 LIMIT 1), (select b.id from sillari.bridge b where b.identifier = 'V-326'), null,
        1064, 13, '2022-04-12 12:45:47.507337 +00:00', null, null, 1);
INSERT INTO sillari.route_bridge (route_id, bridge_id, crossing_instruction, contract_number, ordinal, row_created_time,
                                  row_updated_time, contract_business_id, transport_number)
VALUES ((SELECT id from route_seq_1 LIMIT 1), (select b.id from sillari.bridge b where b.identifier = 'T-1531'), null,
        236, 14, '2022-04-12 12:45:47.507337 +00:00', null, null, 1);
INSERT INTO sillari.route_bridge (route_id, bridge_id, crossing_instruction, contract_number, ordinal, row_created_time,
                                  row_updated_time, contract_business_id, transport_number)
VALUES ((SELECT id from route_seq_1 LIMIT 1), (select b.id from sillari.bridge b where b.identifier = 'T-1531'), null,
        236, 14, '2022-04-12 12:45:47.507337 +00:00', null, null, 7);
INSERT INTO sillari.route_bridge (route_id, bridge_id, crossing_instruction, contract_number, ordinal, row_created_time,
                                  row_updated_time, contract_business_id, transport_number)
VALUES ((SELECT id from route_seq_1 LIMIT 1), (select b.id from sillari.bridge b where b.identifier = 'V-1732'), null,
        1064, 1, '2022-04-12 12:45:47.507337 +00:00', null, null, 8);
INSERT INTO sillari.route_bridge (route_id, bridge_id, crossing_instruction, contract_number, ordinal, row_created_time,
                                  row_updated_time, contract_business_id, transport_number)
VALUES ((SELECT id from route_seq_1 LIMIT 1), (select b.id from sillari.bridge b where b.identifier = 'T-1957'), null,
        241, 2, '2022-04-12 12:45:47.507337 +00:00', null, null, 8);
INSERT INTO sillari.route_bridge (route_id, bridge_id, crossing_instruction, contract_number, ordinal, row_created_time,
                                  row_updated_time, contract_business_id, transport_number)
VALUES ((SELECT id from route_seq_1 LIMIT 1), (select b.id from sillari.bridge b where b.identifier = 'T-848'), null,
        236, 3, '2022-04-12 12:45:47.507337 +00:00', null, null, 8);
INSERT INTO sillari.route_bridge (route_id, bridge_id, crossing_instruction, contract_number, ordinal, row_created_time,
                                  row_updated_time, contract_business_id, transport_number)
VALUES ((SELECT id from route_seq_1 LIMIT 1), (select b.id from sillari.bridge b where b.identifier = 'T-1958'), null,
        241, 4, '2022-04-12 12:45:47.507337 +00:00', null, null, 8);
INSERT INTO sillari.route_bridge (route_id, bridge_id, crossing_instruction, contract_number, ordinal, row_created_time,
                                  row_updated_time, contract_business_id, transport_number)
VALUES ((SELECT id from route_seq_1 LIMIT 1), (select b.id from sillari.bridge b where b.identifier = 'T-848'), null,
        236, 5, '2022-04-12 12:45:47.507337 +00:00', null, null, 8);
INSERT INTO sillari.route_bridge (route_id, bridge_id, crossing_instruction, contract_number, ordinal, row_created_time,
                                  row_updated_time, contract_business_id, transport_number)
VALUES ((SELECT id from route_seq_1 LIMIT 1), (select b.id from sillari.bridge b where b.identifier = 'T-1963'), null,
        241, 6, '2022-04-12 12:45:47.507337 +00:00', null, null, 8);
INSERT INTO sillari.route_bridge (route_id, bridge_id, crossing_instruction, contract_number, ordinal, row_created_time,
                                  row_updated_time, contract_business_id, transport_number)
VALUES ((SELECT id from route_seq_1 LIMIT 1), (select b.id from sillari.bridge b where b.identifier = 'T-1094'), null,
        236, 7, '2022-04-12 12:45:47.507337 +00:00', null, null, 8);
INSERT INTO sillari.route_bridge (route_id, bridge_id, crossing_instruction, contract_number, ordinal, row_created_time,
                                  row_updated_time, contract_business_id, transport_number)
VALUES ((SELECT id from route_seq_1 LIMIT 1), (select b.id from sillari.bridge b where b.identifier = 'T-1095'), null,
        236, 8, '2022-04-12 12:45:47.507337 +00:00', null, null, 8);
INSERT INTO sillari.route_bridge (route_id, bridge_id, crossing_instruction, contract_number, ordinal, row_created_time,
                                  row_updated_time, contract_business_id, transport_number)
VALUES ((SELECT id from route_seq_1 LIMIT 1), (select b.id from sillari.bridge b where b.identifier = 'V-5575'), null,
        1066, 9, '2022-04-12 12:45:47.507337 +00:00', null, null, 8);
INSERT INTO sillari.route_bridge (route_id, bridge_id, crossing_instruction, contract_number, ordinal, row_created_time,
                                  row_updated_time, contract_business_id, transport_number)
VALUES ((SELECT id from route_seq_1 LIMIT 1), (select b.id from sillari.bridge b where b.identifier = 'T-1094'), null,
        236, 10, '2022-04-12 12:45:47.507337 +00:00', null, null, 8);
INSERT INTO sillari.route_bridge (route_id, bridge_id, crossing_instruction, contract_number, ordinal, row_created_time,
                                  row_updated_time, contract_business_id, transport_number)
VALUES ((SELECT id from route_seq_1 LIMIT 1), (select b.id from sillari.bridge b where b.identifier = 'T-1958'), null,
        241, 11, '2022-04-12 12:45:47.507337 +00:00', null, null, 8);
INSERT INTO sillari.route_bridge (route_id, bridge_id, crossing_instruction, contract_number, ordinal, row_created_time,
                                  row_updated_time, contract_business_id, transport_number)
VALUES ((SELECT id from route_seq_1 LIMIT 1), (select b.id from sillari.bridge b where b.identifier = 'T-1531'), null,
        236, 12, '2022-04-12 12:45:47.507337 +00:00', null, null, 8);
INSERT INTO sillari.route_bridge (route_id, bridge_id, crossing_instruction, contract_number, ordinal, row_created_time,
                                  row_updated_time, contract_business_id, transport_number)
VALUES ((SELECT id from route_seq_1 LIMIT 1), (select b.id from sillari.bridge b where b.identifier = 'V-326'), null,
        1064, 13, '2022-04-12 12:45:47.507337 +00:00', null, null, 8);
INSERT INTO sillari.route_bridge (route_id, bridge_id, crossing_instruction, contract_number, ordinal, row_created_time,
                                  row_updated_time, contract_business_id, transport_number)
VALUES ((SELECT id from route_seq_1 LIMIT 1), (select b.id from sillari.bridge b where b.identifier = 'T-1531'), null,
        236, 14, '2022-04-12 12:45:47.507337 +00:00', null, null, 8);
INSERT INTO sillari.route_bridge (route_id, bridge_id, crossing_instruction, contract_number, ordinal, row_created_time,
                                  row_updated_time, contract_business_id, transport_number)
VALUES ((SELECT id from route_seq_1 LIMIT 1), (select b.id from sillari.bridge b where b.identifier = 'V-1732'), null,
        1064, 1, '2022-04-12 12:45:47.507337 +00:00', null, null, 9);
INSERT INTO sillari.route_bridge (route_id, bridge_id, crossing_instruction, contract_number, ordinal, row_created_time,
                                  row_updated_time, contract_business_id, transport_number)
VALUES ((SELECT id from route_seq_1 LIMIT 1), (select b.id from sillari.bridge b where b.identifier = 'T-1957'), null,
        241, 2, '2022-04-12 12:45:47.507337 +00:00', null, null, 9);
INSERT INTO sillari.route_bridge (route_id, bridge_id, crossing_instruction, contract_number, ordinal, row_created_time,
                                  row_updated_time, contract_business_id, transport_number)
VALUES ((SELECT id from route_seq_1 LIMIT 1), (select b.id from sillari.bridge b where b.identifier = 'T-848'), null,
        236, 3, '2022-04-12 12:45:47.507337 +00:00', null, null, 9);
INSERT INTO sillari.route_bridge (route_id, bridge_id, crossing_instruction, contract_number, ordinal, row_created_time,
                                  row_updated_time, contract_business_id, transport_number)
VALUES ((SELECT id from route_seq_1 LIMIT 1), (select b.id from sillari.bridge b where b.identifier = 'T-1958'), null,
        241, 4, '2022-04-12 12:45:47.507337 +00:00', null, null, 9);
INSERT INTO sillari.route_bridge (route_id, bridge_id, crossing_instruction, contract_number, ordinal, row_created_time,
                                  row_updated_time, contract_business_id, transport_number)
VALUES ((SELECT id from route_seq_1 LIMIT 1), (select b.id from sillari.bridge b where b.identifier = 'T-848'), null,
        236, 5, '2022-04-12 12:45:47.507337 +00:00', null, null, 9);
INSERT INTO sillari.route_bridge (route_id, bridge_id, crossing_instruction, contract_number, ordinal, row_created_time,
                                  row_updated_time, contract_business_id, transport_number)
VALUES ((SELECT id from route_seq_1 LIMIT 1), (select b.id from sillari.bridge b where b.identifier = 'T-1963'), null,
        241, 6, '2022-04-12 12:45:47.507337 +00:00', null, null, 9);
INSERT INTO sillari.route_bridge (route_id, bridge_id, crossing_instruction, contract_number, ordinal, row_created_time,
                                  row_updated_time, contract_business_id, transport_number)
VALUES ((SELECT id from route_seq_1 LIMIT 1), (select b.id from sillari.bridge b where b.identifier = 'T-1094'), null,
        236, 7, '2022-04-12 12:45:47.507337 +00:00', null, null, 9);
INSERT INTO sillari.route_bridge (route_id, bridge_id, crossing_instruction, contract_number, ordinal, row_created_time,
                                  row_updated_time, contract_business_id, transport_number)
VALUES ((SELECT id from route_seq_1 LIMIT 1), (select b.id from sillari.bridge b where b.identifier = 'T-1095'), null,
        236, 8, '2022-04-12 12:45:47.507337 +00:00', null, null, 9);
INSERT INTO sillari.route_bridge (route_id, bridge_id, crossing_instruction, contract_number, ordinal, row_created_time,
                                  row_updated_time, contract_business_id, transport_number)
VALUES ((SELECT id from route_seq_1 LIMIT 1), (select b.id from sillari.bridge b where b.identifier = 'V-5575'), null,
        1066, 9, '2022-04-12 12:45:47.507337 +00:00', null, null, 9);
INSERT INTO sillari.route_bridge (route_id, bridge_id, crossing_instruction, contract_number, ordinal, row_created_time,
                                  row_updated_time, contract_business_id, transport_number)
VALUES ((SELECT id from route_seq_1 LIMIT 1), (select b.id from sillari.bridge b where b.identifier = 'T-1094'), null,
        236, 10, '2022-04-12 12:45:47.507337 +00:00', null, null, 9);
INSERT INTO sillari.route_bridge (route_id, bridge_id, crossing_instruction, contract_number, ordinal, row_created_time,
                                  row_updated_time, contract_business_id, transport_number)
VALUES ((SELECT id from route_seq_1 LIMIT 1), (select b.id from sillari.bridge b where b.identifier = 'T-1958'), null,
        241, 11, '2022-04-12 12:45:47.507337 +00:00', null, null, 9);
INSERT INTO sillari.route_bridge (route_id, bridge_id, crossing_instruction, contract_number, ordinal, row_created_time,
                                  row_updated_time, contract_business_id, transport_number)
VALUES ((SELECT id from route_seq_1 LIMIT 1), (select b.id from sillari.bridge b where b.identifier = 'T-1531'), null,
        236, 12, '2022-04-12 12:45:47.507337 +00:00', null, null, 9);
INSERT INTO sillari.route_bridge (route_id, bridge_id, crossing_instruction, contract_number, ordinal, row_created_time,
                                  row_updated_time, contract_business_id, transport_number)
VALUES ((SELECT id from route_seq_1 LIMIT 1), (select b.id from sillari.bridge b where b.identifier = 'V-326'), null,
        1064, 13, '2022-04-12 12:45:47.507337 +00:00', null, null, 9);
INSERT INTO sillari.route_bridge (route_id, bridge_id, crossing_instruction, contract_number, ordinal, row_created_time,
                                  row_updated_time, contract_business_id, transport_number)
VALUES ((SELECT id from route_seq_1 LIMIT 1), (select b.id from sillari.bridge b where b.identifier = 'T-1531'), null,
        236, 14, '2022-04-12 12:45:47.507337 +00:00', null, null, 9);
INSERT INTO sillari.route_bridge (route_id, bridge_id, crossing_instruction, contract_number, ordinal, row_created_time,
                                  row_updated_time, contract_business_id, transport_number)
VALUES ((SELECT id from route_seq_1 LIMIT 1), (select b.id from sillari.bridge b where b.identifier = 'V-1732'), null,
        1064, 1, '2022-04-12 12:45:47.507337 +00:00', null, null, 10);
INSERT INTO sillari.route_bridge (route_id, bridge_id, crossing_instruction, contract_number, ordinal, row_created_time,
                                  row_updated_time, contract_business_id, transport_number)
VALUES ((SELECT id from route_seq_1 LIMIT 1), (select b.id from sillari.bridge b where b.identifier = 'T-1957'), null,
        241, 2, '2022-04-12 12:45:47.507337 +00:00', null, null, 10);
INSERT INTO sillari.route_bridge (route_id, bridge_id, crossing_instruction, contract_number, ordinal, row_created_time,
                                  row_updated_time, contract_business_id, transport_number)
VALUES ((SELECT id from route_seq_1 LIMIT 1), (select b.id from sillari.bridge b where b.identifier = 'T-848'), null,
        236, 3, '2022-04-12 12:45:47.507337 +00:00', null, null, 10);
INSERT INTO sillari.route_bridge (route_id, bridge_id, crossing_instruction, contract_number, ordinal, row_created_time,
                                  row_updated_time, contract_business_id, transport_number)
VALUES ((SELECT id from route_seq_1 LIMIT 1), (select b.id from sillari.bridge b where b.identifier = 'T-1958'), null,
        241, 4, '2022-04-12 12:45:47.507337 +00:00', null, null, 10);
INSERT INTO sillari.route_bridge (route_id, bridge_id, crossing_instruction, contract_number, ordinal, row_created_time,
                                  row_updated_time, contract_business_id, transport_number)
VALUES ((SELECT id from route_seq_1 LIMIT 1), (select b.id from sillari.bridge b where b.identifier = 'T-848'), null,
        236, 5, '2022-04-12 12:45:47.507337 +00:00', null, null, 10);
INSERT INTO sillari.route_bridge (route_id, bridge_id, crossing_instruction, contract_number, ordinal, row_created_time,
                                  row_updated_time, contract_business_id, transport_number)
VALUES ((SELECT id from route_seq_1 LIMIT 1), (select b.id from sillari.bridge b where b.identifier = 'T-1963'), null,
        241, 6, '2022-04-12 12:45:47.507337 +00:00', null, null, 10);
INSERT INTO sillari.route_bridge (route_id, bridge_id, crossing_instruction, contract_number, ordinal, row_created_time,
                                  row_updated_time, contract_business_id, transport_number)
VALUES ((SELECT id from route_seq_1 LIMIT 1), (select b.id from sillari.bridge b where b.identifier = 'T-1094'), null,
        236, 7, '2022-04-12 12:45:47.507337 +00:00', null, null, 10);
INSERT INTO sillari.route_bridge (route_id, bridge_id, crossing_instruction, contract_number, ordinal, row_created_time,
                                  row_updated_time, contract_business_id, transport_number)
VALUES ((SELECT id from route_seq_1 LIMIT 1), (select b.id from sillari.bridge b where b.identifier = 'T-1095'), null,
        236, 8, '2022-04-12 12:45:47.507337 +00:00', null, null, 10);
INSERT INTO sillari.route_bridge (route_id, bridge_id, crossing_instruction, contract_number, ordinal, row_created_time,
                                  row_updated_time, contract_business_id, transport_number)
VALUES ((SELECT id from route_seq_1 LIMIT 1), (select b.id from sillari.bridge b where b.identifier = 'V-5575'), null,
        1066, 9, '2022-04-12 12:45:47.507337 +00:00', null, null, 10);
INSERT INTO sillari.route_bridge (route_id, bridge_id, crossing_instruction, contract_number, ordinal, row_created_time,
                                  row_updated_time, contract_business_id, transport_number)
VALUES ((SELECT id from route_seq_1 LIMIT 1), (select b.id from sillari.bridge b where b.identifier = 'T-1094'), null,
        236, 10, '2022-04-12 12:45:47.507337 +00:00', null, null, 10);
INSERT INTO sillari.route_bridge (route_id, bridge_id, crossing_instruction, contract_number, ordinal, row_created_time,
                                  row_updated_time, contract_business_id, transport_number)
VALUES ((SELECT id from route_seq_1 LIMIT 1), (select b.id from sillari.bridge b where b.identifier = 'T-1958'), null,
        241, 11, '2022-04-12 12:45:47.507337 +00:00', null, null, 10);
INSERT INTO sillari.route_bridge (route_id, bridge_id, crossing_instruction, contract_number, ordinal, row_created_time,
                                  row_updated_time, contract_business_id, transport_number)
VALUES ((SELECT id from route_seq_1 LIMIT 1), (select b.id from sillari.bridge b where b.identifier = 'T-1531'), null,
        236, 12, '2022-04-12 12:45:47.507337 +00:00', null, null, 10);
INSERT INTO sillari.route_bridge (route_id, bridge_id, crossing_instruction, contract_number, ordinal, row_created_time,
                                  row_updated_time, contract_business_id, transport_number)
VALUES ((SELECT id from route_seq_1 LIMIT 1), (select b.id from sillari.bridge b where b.identifier = 'V-326'), null,
        1064, 13, '2022-04-12 12:45:47.507337 +00:00', null, null, 10);
INSERT INTO sillari.route_bridge (route_id, bridge_id, crossing_instruction, contract_number, ordinal, row_created_time,
                                  row_updated_time, contract_business_id, transport_number)
VALUES ((SELECT id from route_seq_1 LIMIT 1), (select b.id from sillari.bridge b where b.identifier = 'T-1531'), null,
        236, 14, '2022-04-12 12:45:47.507337 +00:00', null, null, 10);
INSERT INTO sillari.route_bridge (route_id, bridge_id, crossing_instruction, contract_number, ordinal, row_created_time,
                                  row_updated_time, contract_business_id, transport_number)
VALUES ((SELECT id from route_seq_1 LIMIT 1), (select b.id from sillari.bridge b where b.identifier = 'V-1732'), null,
        1064, 1, '2022-04-12 12:45:47.507337 +00:00', null, null, 11);
INSERT INTO sillari.route_bridge (route_id, bridge_id, crossing_instruction, contract_number, ordinal, row_created_time,
                                  row_updated_time, contract_business_id, transport_number)
VALUES ((SELECT id from route_seq_1 LIMIT 1), (select b.id from sillari.bridge b where b.identifier = 'T-1957'), null,
        241, 2, '2022-04-12 12:45:47.507337 +00:00', null, null, 11);
INSERT INTO sillari.route_bridge (route_id, bridge_id, crossing_instruction, contract_number, ordinal, row_created_time,
                                  row_updated_time, contract_business_id, transport_number)
VALUES ((SELECT id from route_seq_1 LIMIT 1), (select b.id from sillari.bridge b where b.identifier = 'T-848'), null,
        236, 3, '2022-04-12 12:45:47.507337 +00:00', null, null, 11);
INSERT INTO sillari.route_bridge (route_id, bridge_id, crossing_instruction, contract_number, ordinal, row_created_time,
                                  row_updated_time, contract_business_id, transport_number)
VALUES ((SELECT id from route_seq_1 LIMIT 1), (select b.id from sillari.bridge b where b.identifier = 'T-1958'), null,
        241, 4, '2022-04-12 12:45:47.507337 +00:00', null, null, 11);
INSERT INTO sillari.route_bridge (route_id, bridge_id, crossing_instruction, contract_number, ordinal, row_created_time,
                                  row_updated_time, contract_business_id, transport_number)
VALUES ((SELECT id from route_seq_1 LIMIT 1), (select b.id from sillari.bridge b where b.identifier = 'T-848'), null,
        236, 5, '2022-04-12 12:45:47.507337 +00:00', null, null, 11);
INSERT INTO sillari.route_bridge (route_id, bridge_id, crossing_instruction, contract_number, ordinal, row_created_time,
                                  row_updated_time, contract_business_id, transport_number)
VALUES ((SELECT id from route_seq_1 LIMIT 1), (select b.id from sillari.bridge b where b.identifier = 'T-1963'), null,
        241, 6, '2022-04-12 12:45:47.507337 +00:00', null, null, 11);
INSERT INTO sillari.route_bridge (route_id, bridge_id, crossing_instruction, contract_number, ordinal, row_created_time,
                                  row_updated_time, contract_business_id, transport_number)
VALUES ((SELECT id from route_seq_1 LIMIT 1), (select b.id from sillari.bridge b where b.identifier = 'T-1094'), null,
        236, 7, '2022-04-12 12:45:47.507337 +00:00', null, null, 11);
INSERT INTO sillari.route_bridge (route_id, bridge_id, crossing_instruction, contract_number, ordinal, row_created_time,
                                  row_updated_time, contract_business_id, transport_number)
VALUES ((SELECT id from route_seq_1 LIMIT 1), (select b.id from sillari.bridge b where b.identifier = 'T-1095'), null,
        236, 8, '2022-04-12 12:45:47.507337 +00:00', null, null, 11);
INSERT INTO sillari.route_bridge (route_id, bridge_id, crossing_instruction, contract_number, ordinal, row_created_time,
                                  row_updated_time, contract_business_id, transport_number)
VALUES ((SELECT id from route_seq_1 LIMIT 1), (select b.id from sillari.bridge b where b.identifier = 'V-5575'), null,
        1066, 9, '2022-04-12 12:45:47.507337 +00:00', null, null, 11);
INSERT INTO sillari.route_bridge (route_id, bridge_id, crossing_instruction, contract_number, ordinal, row_created_time,
                                  row_updated_time, contract_business_id, transport_number)
VALUES ((SELECT id from route_seq_1 LIMIT 1), (select b.id from sillari.bridge b where b.identifier = 'T-1094'), null,
        236, 10, '2022-04-12 12:45:47.507337 +00:00', null, null, 11);
INSERT INTO sillari.route_bridge (route_id, bridge_id, crossing_instruction, contract_number, ordinal, row_created_time,
                                  row_updated_time, contract_business_id, transport_number)
VALUES ((SELECT id from route_seq_1 LIMIT 1), (select b.id from sillari.bridge b where b.identifier = 'T-1958'), null,
        241, 11, '2022-04-12 12:45:47.507337 +00:00', null, null, 11);
INSERT INTO sillari.route_bridge (route_id, bridge_id, crossing_instruction, contract_number, ordinal, row_created_time,
                                  row_updated_time, contract_business_id, transport_number)
VALUES ((SELECT id from route_seq_1 LIMIT 1), (select b.id from sillari.bridge b where b.identifier = 'T-1531'), null,
        236, 12, '2022-04-12 12:45:47.507337 +00:00', null, null, 11);
INSERT INTO sillari.route_bridge (route_id, bridge_id, crossing_instruction, contract_number, ordinal, row_created_time,
                                  row_updated_time, contract_business_id, transport_number)
VALUES ((SELECT id from route_seq_1 LIMIT 1), (select b.id from sillari.bridge b where b.identifier = 'V-326'), null,
        1064, 13, '2022-04-12 12:45:47.507337 +00:00', null, null, 11);
INSERT INTO sillari.route_bridge (route_id, bridge_id, crossing_instruction, contract_number, ordinal, row_created_time,
                                  row_updated_time, contract_business_id, transport_number)
VALUES ((SELECT id from route_seq_1 LIMIT 1), (select b.id from sillari.bridge b where b.identifier = 'T-1531'), null,
        236, 14, '2022-04-12 12:45:47.507337 +00:00', null, null, 11);
INSERT INTO sillari.route_bridge (route_id, bridge_id, crossing_instruction, contract_number, ordinal, row_created_time,
                                  row_updated_time, contract_business_id, transport_number)
VALUES ((SELECT id from route_seq_1 LIMIT 1), (select b.id from sillari.bridge b where b.identifier = 'V-1732'), null,
        1064, 1, '2022-04-12 12:45:47.507337 +00:00', null, null, 12);
INSERT INTO sillari.route_bridge (route_id, bridge_id, crossing_instruction, contract_number, ordinal, row_created_time,
                                  row_updated_time, contract_business_id, transport_number)
VALUES ((SELECT id from route_seq_1 LIMIT 1), (select b.id from sillari.bridge b where b.identifier = 'T-1957'), null,
        241, 2, '2022-04-12 12:45:47.507337 +00:00', null, null, 12);
INSERT INTO sillari.route_bridge (route_id, bridge_id, crossing_instruction, contract_number, ordinal, row_created_time,
                                  row_updated_time, contract_business_id, transport_number)
VALUES ((SELECT id from route_seq_1 LIMIT 1), (select b.id from sillari.bridge b where b.identifier = 'T-848'), null,
        236, 3, '2022-04-12 12:45:47.507337 +00:00', null, null, 12);
INSERT INTO sillari.route_bridge (route_id, bridge_id, crossing_instruction, contract_number, ordinal, row_created_time,
                                  row_updated_time, contract_business_id, transport_number)
VALUES ((SELECT id from route_seq_1 LIMIT 1), (select b.id from sillari.bridge b where b.identifier = 'T-1958'), null,
        241, 4, '2022-04-12 12:45:47.507337 +00:00', null, null, 12);
INSERT INTO sillari.route_bridge (route_id, bridge_id, crossing_instruction, contract_number, ordinal, row_created_time,
                                  row_updated_time, contract_business_id, transport_number)
VALUES ((SELECT id from route_seq_1 LIMIT 1), (select b.id from sillari.bridge b where b.identifier = 'T-848'), null,
        236, 5, '2022-04-12 12:45:47.507337 +00:00', null, null, 12);
INSERT INTO sillari.route_bridge (route_id, bridge_id, crossing_instruction, contract_number, ordinal, row_created_time,
                                  row_updated_time, contract_business_id, transport_number)
VALUES ((SELECT id from route_seq_1 LIMIT 1), (select b.id from sillari.bridge b where b.identifier = 'T-1963'), null,
        241, 6, '2022-04-12 12:45:47.507337 +00:00', null, null, 12);
INSERT INTO sillari.route_bridge (route_id, bridge_id, crossing_instruction, contract_number, ordinal, row_created_time,
                                  row_updated_time, contract_business_id, transport_number)
VALUES ((SELECT id from route_seq_1 LIMIT 1), (select b.id from sillari.bridge b where b.identifier = 'T-1094'), null,
        236, 7, '2022-04-12 12:45:47.507337 +00:00', null, null, 12);
INSERT INTO sillari.route_bridge (route_id, bridge_id, crossing_instruction, contract_number, ordinal, row_created_time,
                                  row_updated_time, contract_business_id, transport_number)
VALUES ((SELECT id from route_seq_1 LIMIT 1), (select b.id from sillari.bridge b where b.identifier = 'T-1095'), null,
        236, 8, '2022-04-12 12:45:47.507337 +00:00', null, null, 12);
INSERT INTO sillari.route_bridge (route_id, bridge_id, crossing_instruction, contract_number, ordinal, row_created_time,
                                  row_updated_time, contract_business_id, transport_number)
VALUES ((SELECT id from route_seq_1 LIMIT 1), (select b.id from sillari.bridge b where b.identifier = 'V-5575'), null,
        1066, 9, '2022-04-12 12:45:47.507337 +00:00', null, null, 12);
INSERT INTO sillari.route_bridge (route_id, bridge_id, crossing_instruction, contract_number, ordinal, row_created_time,
                                  row_updated_time, contract_business_id, transport_number)
VALUES ((SELECT id from route_seq_1 LIMIT 1), (select b.id from sillari.bridge b where b.identifier = 'T-1094'), null,
        236, 10, '2022-04-12 12:45:47.507337 +00:00', null, null, 12);
INSERT INTO sillari.route_bridge (route_id, bridge_id, crossing_instruction, contract_number, ordinal, row_created_time,
                                  row_updated_time, contract_business_id, transport_number)
VALUES ((SELECT id from route_seq_1 LIMIT 1), (select b.id from sillari.bridge b where b.identifier = 'T-1958'), null,
        241, 11, '2022-04-12 12:45:47.507337 +00:00', null, null, 12);
INSERT INTO sillari.route_bridge (route_id, bridge_id, crossing_instruction, contract_number, ordinal, row_created_time,
                                  row_updated_time, contract_business_id, transport_number)
VALUES ((SELECT id from route_seq_1 LIMIT 1), (select b.id from sillari.bridge b where b.identifier = 'T-1531'), null,
        236, 12, '2022-04-12 12:45:47.507337 +00:00', null, null, 12);
INSERT INTO sillari.route_bridge (route_id, bridge_id, crossing_instruction, contract_number, ordinal, row_created_time,
                                  row_updated_time, contract_business_id, transport_number)
VALUES ((SELECT id from route_seq_1 LIMIT 1), (select b.id from sillari.bridge b where b.identifier = 'V-326'), null,
        1064, 13, '2022-04-12 12:45:47.507337 +00:00', null, null, 12);
INSERT INTO sillari.route_bridge (route_id, bridge_id, crossing_instruction, contract_number, ordinal, row_created_time,
                                  row_updated_time, contract_business_id, transport_number)
VALUES ((SELECT id from route_seq_1 LIMIT 1), (select b.id from sillari.bridge b where b.identifier = 'T-1531'), null,
        236, 14, '2022-04-12 12:45:47.507337 +00:00', null, null, 12);
INSERT INTO sillari.route_bridge (route_id, bridge_id, crossing_instruction, contract_number, ordinal, row_created_time,
                                  row_updated_time, contract_business_id, transport_number)
VALUES ((SELECT id from route_seq_1 LIMIT 1), (select b.id from sillari.bridge b where b.identifier = 'V-1732'), null,
        1064, 1, '2022-04-12 12:45:47.507337 +00:00', null, null, 13);
INSERT INTO sillari.route_bridge (route_id, bridge_id, crossing_instruction, contract_number, ordinal, row_created_time,
                                  row_updated_time, contract_business_id, transport_number)
VALUES ((SELECT id from route_seq_1 LIMIT 1), (select b.id from sillari.bridge b where b.identifier = 'T-1957'), null,
        241, 2, '2022-04-12 12:45:47.507337 +00:00', null, null, 13);
INSERT INTO sillari.route_bridge (route_id, bridge_id, crossing_instruction, contract_number, ordinal, row_created_time,
                                  row_updated_time, contract_business_id, transport_number)
VALUES ((SELECT id from route_seq_1 LIMIT 1), (select b.id from sillari.bridge b where b.identifier = 'T-848'), null,
        236, 3, '2022-04-12 12:45:47.507337 +00:00', null, null, 13);
INSERT INTO sillari.route_bridge (route_id, bridge_id, crossing_instruction, contract_number, ordinal, row_created_time,
                                  row_updated_time, contract_business_id, transport_number)
VALUES ((SELECT id from route_seq_1 LIMIT 1), (select b.id from sillari.bridge b where b.identifier = 'T-1958'), null,
        241, 4, '2022-04-12 12:45:47.507337 +00:00', null, null, 13);
INSERT INTO sillari.route_bridge (route_id, bridge_id, crossing_instruction, contract_number, ordinal, row_created_time,
                                  row_updated_time, contract_business_id, transport_number)
VALUES ((SELECT id from route_seq_1 LIMIT 1), (select b.id from sillari.bridge b where b.identifier = 'T-848'), null,
        236, 5, '2022-04-12 12:45:47.507337 +00:00', null, null, 13);
INSERT INTO sillari.route_bridge (route_id, bridge_id, crossing_instruction, contract_number, ordinal, row_created_time,
                                  row_updated_time, contract_business_id, transport_number)
VALUES ((SELECT id from route_seq_1 LIMIT 1), (select b.id from sillari.bridge b where b.identifier = 'T-1963'), null,
        241, 6, '2022-04-12 12:45:47.507337 +00:00', null, null, 13);
INSERT INTO sillari.route_bridge (route_id, bridge_id, crossing_instruction, contract_number, ordinal, row_created_time,
                                  row_updated_time, contract_business_id, transport_number)
VALUES ((SELECT id from route_seq_1 LIMIT 1), (select b.id from sillari.bridge b where b.identifier = 'T-1094'), null,
        236, 7, '2022-04-12 12:45:47.507337 +00:00', null, null, 13);
INSERT INTO sillari.route_bridge (route_id, bridge_id, crossing_instruction, contract_number, ordinal, row_created_time,
                                  row_updated_time, contract_business_id, transport_number)
VALUES ((SELECT id from route_seq_1 LIMIT 1), (select b.id from sillari.bridge b where b.identifier = 'T-1095'), null,
        236, 8, '2022-04-12 12:45:47.507337 +00:00', null, null, 13);
INSERT INTO sillari.route_bridge (route_id, bridge_id, crossing_instruction, contract_number, ordinal, row_created_time,
                                  row_updated_time, contract_business_id, transport_number)
VALUES ((SELECT id from route_seq_1 LIMIT 1), (select b.id from sillari.bridge b where b.identifier = 'V-5575'), null,
        1066, 9, '2022-04-12 12:45:47.507337 +00:00', null, null, 13);
INSERT INTO sillari.route_bridge (route_id, bridge_id, crossing_instruction, contract_number, ordinal, row_created_time,
                                  row_updated_time, contract_business_id, transport_number)
VALUES ((SELECT id from route_seq_1 LIMIT 1), (select b.id from sillari.bridge b where b.identifier = 'T-1094'), null,
        236, 10, '2022-04-12 12:45:47.507337 +00:00', null, null, 13);
INSERT INTO sillari.route_bridge (route_id, bridge_id, crossing_instruction, contract_number, ordinal, row_created_time,
                                  row_updated_time, contract_business_id, transport_number)
VALUES ((SELECT id from route_seq_1 LIMIT 1), (select b.id from sillari.bridge b where b.identifier = 'T-1958'), null,
        241, 11, '2022-04-12 12:45:47.507337 +00:00', null, null, 13);
INSERT INTO sillari.route_bridge (route_id, bridge_id, crossing_instruction, contract_number, ordinal, row_created_time,
                                  row_updated_time, contract_business_id, transport_number)
VALUES ((SELECT id from route_seq_1 LIMIT 1), (select b.id from sillari.bridge b where b.identifier = 'T-1531'), null,
        236, 12, '2022-04-12 12:45:47.507337 +00:00', null, null, 13);
INSERT INTO sillari.route_bridge (route_id, bridge_id, crossing_instruction, contract_number, ordinal, row_created_time,
                                  row_updated_time, contract_business_id, transport_number)
VALUES ((SELECT id from route_seq_1 LIMIT 1), (select b.id from sillari.bridge b where b.identifier = 'V-326'), null,
        1064, 13, '2022-04-12 12:45:47.507337 +00:00', null, null, 13);
INSERT INTO sillari.route_bridge (route_id, bridge_id, crossing_instruction, contract_number, ordinal, row_created_time,
                                  row_updated_time, contract_business_id, transport_number)
VALUES ((SELECT id from route_seq_1 LIMIT 1), (select b.id from sillari.bridge b where b.identifier = 'T-1531'), null,
        236, 14, '2022-04-12 12:45:47.507337 +00:00', null, null, 13);
INSERT INTO sillari.route_bridge (route_id, bridge_id, crossing_instruction, contract_number, ordinal, row_created_time,
                                  row_updated_time, contract_business_id, transport_number)
VALUES ((SELECT id from route_seq_1 LIMIT 1), (select b.id from sillari.bridge b where b.identifier = 'V-1732'), null,
        1064, 1, '2022-04-12 12:45:47.507337 +00:00', null, null, 14);
INSERT INTO sillari.route_bridge (route_id, bridge_id, crossing_instruction, contract_number, ordinal, row_created_time,
                                  row_updated_time, contract_business_id, transport_number)
VALUES ((SELECT id from route_seq_1 LIMIT 1), (select b.id from sillari.bridge b where b.identifier = 'T-1957'), null,
        241, 2, '2022-04-12 12:45:47.507337 +00:00', null, null, 14);
INSERT INTO sillari.route_bridge (route_id, bridge_id, crossing_instruction, contract_number, ordinal, row_created_time,
                                  row_updated_time, contract_business_id, transport_number)
VALUES ((SELECT id from route_seq_1 LIMIT 1), (select b.id from sillari.bridge b where b.identifier = 'T-848'), null,
        236, 3, '2022-04-12 12:45:47.507337 +00:00', null, null, 14);
INSERT INTO sillari.route_bridge (route_id, bridge_id, crossing_instruction, contract_number, ordinal, row_created_time,
                                  row_updated_time, contract_business_id, transport_number)
VALUES ((SELECT id from route_seq_1 LIMIT 1), (select b.id from sillari.bridge b where b.identifier = 'T-1958'), null,
        241, 4, '2022-04-12 12:45:47.507337 +00:00', null, null, 14);
INSERT INTO sillari.route_bridge (route_id, bridge_id, crossing_instruction, contract_number, ordinal, row_created_time,
                                  row_updated_time, contract_business_id, transport_number)
VALUES ((SELECT id from route_seq_1 LIMIT 1), (select b.id from sillari.bridge b where b.identifier = 'T-848'), null,
        236, 5, '2022-04-12 12:45:47.507337 +00:00', null, null, 14);
INSERT INTO sillari.route_bridge (route_id, bridge_id, crossing_instruction, contract_number, ordinal, row_created_time,
                                  row_updated_time, contract_business_id, transport_number)
VALUES ((SELECT id from route_seq_1 LIMIT 1), (select b.id from sillari.bridge b where b.identifier = 'T-1963'), null,
        241, 6, '2022-04-12 12:45:47.507337 +00:00', null, null, 14);
INSERT INTO sillari.route_bridge (route_id, bridge_id, crossing_instruction, contract_number, ordinal, row_created_time,
                                  row_updated_time, contract_business_id, transport_number)
VALUES ((SELECT id from route_seq_1 LIMIT 1), (select b.id from sillari.bridge b where b.identifier = 'T-1094'), null,
        236, 7, '2022-04-12 12:45:47.507337 +00:00', null, null, 14);
INSERT INTO sillari.route_bridge (route_id, bridge_id, crossing_instruction, contract_number, ordinal, row_created_time,
                                  row_updated_time, contract_business_id, transport_number)
VALUES ((SELECT id from route_seq_1 LIMIT 1), (select b.id from sillari.bridge b where b.identifier = 'T-1095'), null,
        236, 8, '2022-04-12 12:45:47.507337 +00:00', null, null, 14);
INSERT INTO sillari.route_bridge (route_id, bridge_id, crossing_instruction, contract_number, ordinal, row_created_time,
                                  row_updated_time, contract_business_id, transport_number)
VALUES ((SELECT id from route_seq_1 LIMIT 1), (select b.id from sillari.bridge b where b.identifier = 'V-5575'), null,
        1066, 9, '2022-04-12 12:45:47.507337 +00:00', null, null, 14);
INSERT INTO sillari.route_bridge (route_id, bridge_id, crossing_instruction, contract_number, ordinal, row_created_time,
                                  row_updated_time, contract_business_id, transport_number)
VALUES ((SELECT id from route_seq_1 LIMIT 1), (select b.id from sillari.bridge b where b.identifier = 'T-1094'), null,
        236, 10, '2022-04-12 12:45:47.507337 +00:00', null, null, 14);
INSERT INTO sillari.route_bridge (route_id, bridge_id, crossing_instruction, contract_number, ordinal, row_created_time,
                                  row_updated_time, contract_business_id, transport_number)
VALUES ((SELECT id from route_seq_1 LIMIT 1), (select b.id from sillari.bridge b where b.identifier = 'T-1958'), null,
        241, 11, '2022-04-12 12:45:47.507337 +00:00', null, null, 14);
INSERT INTO sillari.route_bridge (route_id, bridge_id, crossing_instruction, contract_number, ordinal, row_created_time,
                                  row_updated_time, contract_business_id, transport_number)
VALUES ((SELECT id from route_seq_1 LIMIT 1), (select b.id from sillari.bridge b where b.identifier = 'T-1531'), null,
        236, 12, '2022-04-12 12:45:47.507337 +00:00', null, null, 14);
INSERT INTO sillari.route_bridge (route_id, bridge_id, crossing_instruction, contract_number, ordinal, row_created_time,
                                  row_updated_time, contract_business_id, transport_number)
VALUES ((SELECT id from route_seq_1 LIMIT 1), (select b.id from sillari.bridge b where b.identifier = 'V-326'), null,
        1064, 13, '2022-04-12 12:45:47.507337 +00:00', null, null, 14);
INSERT INTO sillari.route_bridge (route_id, bridge_id, crossing_instruction, contract_number, ordinal, row_created_time,
                                  row_updated_time, contract_business_id, transport_number)
VALUES ((SELECT id from route_seq_1 LIMIT 1), (select b.id from sillari.bridge b where b.identifier = 'T-1531'), null,
        236, 14, '2022-04-12 12:45:47.507337 +00:00', null, null, 14);
INSERT INTO sillari.route_bridge (route_id, bridge_id, crossing_instruction, contract_number, ordinal, row_created_time,
                                  row_updated_time, contract_business_id, transport_number)
VALUES ((SELECT id from route_seq_1 LIMIT 1), (select b.id from sillari.bridge b where b.identifier = 'V-1732'), null,
        1064, 1, '2022-04-12 12:45:47.507337 +00:00', null, null, 15);
INSERT INTO sillari.route_bridge (route_id, bridge_id, crossing_instruction, contract_number, ordinal, row_created_time,
                                  row_updated_time, contract_business_id, transport_number)
VALUES ((SELECT id from route_seq_1 LIMIT 1), (select b.id from sillari.bridge b where b.identifier = 'T-1957'), null,
        241, 2, '2022-04-12 12:45:47.507337 +00:00', null, null, 15);
INSERT INTO sillari.route_bridge (route_id, bridge_id, crossing_instruction, contract_number, ordinal, row_created_time,
                                  row_updated_time, contract_business_id, transport_number)
VALUES ((SELECT id from route_seq_1 LIMIT 1), (select b.id from sillari.bridge b where b.identifier = 'T-848'), null,
        236, 3, '2022-04-12 12:45:47.507337 +00:00', null, null, 15);
INSERT INTO sillari.route_bridge (route_id, bridge_id, crossing_instruction, contract_number, ordinal, row_created_time,
                                  row_updated_time, contract_business_id, transport_number)
VALUES ((SELECT id from route_seq_1 LIMIT 1), (select b.id from sillari.bridge b where b.identifier = 'T-1958'), null,
        241, 4, '2022-04-12 12:45:47.507337 +00:00', null, null, 15);
INSERT INTO sillari.route_bridge (route_id, bridge_id, crossing_instruction, contract_number, ordinal, row_created_time,
                                  row_updated_time, contract_business_id, transport_number)
VALUES ((SELECT id from route_seq_1 LIMIT 1), (select b.id from sillari.bridge b where b.identifier = 'T-848'), null,
        236, 5, '2022-04-12 12:45:47.507337 +00:00', null, null, 15);
INSERT INTO sillari.route_bridge (route_id, bridge_id, crossing_instruction, contract_number, ordinal, row_created_time,
                                  row_updated_time, contract_business_id, transport_number)
VALUES ((SELECT id from route_seq_1 LIMIT 1), (select b.id from sillari.bridge b where b.identifier = 'T-1963'), null,
        241, 6, '2022-04-12 12:45:47.507337 +00:00', null, null, 15);
INSERT INTO sillari.route_bridge (route_id, bridge_id, crossing_instruction, contract_number, ordinal, row_created_time,
                                  row_updated_time, contract_business_id, transport_number)
VALUES ((SELECT id from route_seq_1 LIMIT 1), (select b.id from sillari.bridge b where b.identifier = 'T-1094'), null,
        236, 7, '2022-04-12 12:45:47.507337 +00:00', null, null, 15);
INSERT INTO sillari.route_bridge (route_id, bridge_id, crossing_instruction, contract_number, ordinal, row_created_time,
                                  row_updated_time, contract_business_id, transport_number)
VALUES ((SELECT id from route_seq_1 LIMIT 1), (select b.id from sillari.bridge b where b.identifier = 'T-1095'), null,
        236, 8, '2022-04-12 12:45:47.507337 +00:00', null, null, 15);
INSERT INTO sillari.route_bridge (route_id, bridge_id, crossing_instruction, contract_number, ordinal, row_created_time,
                                  row_updated_time, contract_business_id, transport_number)
VALUES ((SELECT id from route_seq_1 LIMIT 1), (select b.id from sillari.bridge b where b.identifier = 'V-5575'), null,
        1066, 9, '2022-04-12 12:45:47.507337 +00:00', null, null, 15);
INSERT INTO sillari.route_bridge (route_id, bridge_id, crossing_instruction, contract_number, ordinal, row_created_time,
                                  row_updated_time, contract_business_id, transport_number)
VALUES ((SELECT id from route_seq_1 LIMIT 1), (select b.id from sillari.bridge b where b.identifier = 'T-1094'), null,
        236, 10, '2022-04-12 12:45:47.507337 +00:00', null, null, 15);
INSERT INTO sillari.route_bridge (route_id, bridge_id, crossing_instruction, contract_number, ordinal, row_created_time,
                                  row_updated_time, contract_business_id, transport_number)
VALUES ((SELECT id from route_seq_1 LIMIT 1), (select b.id from sillari.bridge b where b.identifier = 'T-1958'), null,
        241, 11, '2022-04-12 12:45:47.507337 +00:00', null, null, 15);
INSERT INTO sillari.route_bridge (route_id, bridge_id, crossing_instruction, contract_number, ordinal, row_created_time,
                                  row_updated_time, contract_business_id, transport_number)
VALUES ((SELECT id from route_seq_1 LIMIT 1), (select b.id from sillari.bridge b where b.identifier = 'T-1531'), null,
        236, 12, '2022-04-12 12:45:47.507337 +00:00', null, null, 15);
INSERT INTO sillari.route_bridge (route_id, bridge_id, crossing_instruction, contract_number, ordinal, row_created_time,
                                  row_updated_time, contract_business_id, transport_number)
VALUES ((SELECT id from route_seq_1 LIMIT 1), (select b.id from sillari.bridge b where b.identifier = 'V-326'), null,
        1064, 13, '2022-04-12 12:45:47.507337 +00:00', null, null, 15);
INSERT INTO sillari.route_bridge (route_id, bridge_id, crossing_instruction, contract_number, ordinal, row_created_time,
                                  row_updated_time, contract_business_id, transport_number)
VALUES ((SELECT id from route_seq_1 LIMIT 1), (select b.id from sillari.bridge b where b.identifier = 'T-1531'), null,
        236, 14, '2022-04-12 12:45:47.507337 +00:00', null, null, 15);
INSERT INTO sillari.route_bridge (route_id, bridge_id, crossing_instruction, contract_number, ordinal, row_created_time,
                                  row_updated_time, contract_business_id, transport_number)
VALUES ((SELECT id from route_seq_1 LIMIT 1), (select b.id from sillari.bridge b where b.identifier = 'V-1732'), null,
        1064, 1, '2022-04-12 12:45:47.507337 +00:00', null, null, 16);
INSERT INTO sillari.route_bridge (route_id, bridge_id, crossing_instruction, contract_number, ordinal, row_created_time,
                                  row_updated_time, contract_business_id, transport_number)
VALUES ((SELECT id from route_seq_1 LIMIT 1), (select b.id from sillari.bridge b where b.identifier = 'T-1957'), null,
        241, 2, '2022-04-12 12:45:47.507337 +00:00', null, null, 16);
INSERT INTO sillari.route_bridge (route_id, bridge_id, crossing_instruction, contract_number, ordinal, row_created_time,
                                  row_updated_time, contract_business_id, transport_number)
VALUES ((SELECT id from route_seq_1 LIMIT 1), (select b.id from sillari.bridge b where b.identifier = 'T-848'), null,
        236, 3, '2022-04-12 12:45:47.507337 +00:00', null, null, 16);
INSERT INTO sillari.route_bridge (route_id, bridge_id, crossing_instruction, contract_number, ordinal, row_created_time,
                                  row_updated_time, contract_business_id, transport_number)
VALUES ((SELECT id from route_seq_1 LIMIT 1), (select b.id from sillari.bridge b where b.identifier = 'T-1958'), null,
        241, 4, '2022-04-12 12:45:47.507337 +00:00', null, null, 16);
INSERT INTO sillari.route_bridge (route_id, bridge_id, crossing_instruction, contract_number, ordinal, row_created_time,
                                  row_updated_time, contract_business_id, transport_number)
VALUES ((SELECT id from route_seq_1 LIMIT 1), (select b.id from sillari.bridge b where b.identifier = 'T-848'), null,
        236, 5, '2022-04-12 12:45:47.507337 +00:00', null, null, 16);
INSERT INTO sillari.route_bridge (route_id, bridge_id, crossing_instruction, contract_number, ordinal, row_created_time,
                                  row_updated_time, contract_business_id, transport_number)
VALUES ((SELECT id from route_seq_1 LIMIT 1), (select b.id from sillari.bridge b where b.identifier = 'T-1963'), null,
        241, 6, '2022-04-12 12:45:47.507337 +00:00', null, null, 16);
INSERT INTO sillari.route_bridge (route_id, bridge_id, crossing_instruction, contract_number, ordinal, row_created_time,
                                  row_updated_time, contract_business_id, transport_number)
VALUES ((SELECT id from route_seq_1 LIMIT 1), (select b.id from sillari.bridge b where b.identifier = 'T-1094'), null,
        236, 7, '2022-04-12 12:45:47.507337 +00:00', null, null, 16);
INSERT INTO sillari.route_bridge (route_id, bridge_id, crossing_instruction, contract_number, ordinal, row_created_time,
                                  row_updated_time, contract_business_id, transport_number)
VALUES ((SELECT id from route_seq_1 LIMIT 1), (select b.id from sillari.bridge b where b.identifier = 'T-1095'), null,
        236, 8, '2022-04-12 12:45:47.507337 +00:00', null, null, 16);
INSERT INTO sillari.route_bridge (route_id, bridge_id, crossing_instruction, contract_number, ordinal, row_created_time,
                                  row_updated_time, contract_business_id, transport_number)
VALUES ((SELECT id from route_seq_1 LIMIT 1), (select b.id from sillari.bridge b where b.identifier = 'V-5575'), null,
        1066, 9, '2022-04-12 12:45:47.507337 +00:00', null, null, 16);
INSERT INTO sillari.route_bridge (route_id, bridge_id, crossing_instruction, contract_number, ordinal, row_created_time,
                                  row_updated_time, contract_business_id, transport_number)
VALUES ((SELECT id from route_seq_1 LIMIT 1), (select b.id from sillari.bridge b where b.identifier = 'T-1094'), null,
        236, 10, '2022-04-12 12:45:47.507337 +00:00', null, null, 16);
INSERT INTO sillari.route_bridge (route_id, bridge_id, crossing_instruction, contract_number, ordinal, row_created_time,
                                  row_updated_time, contract_business_id, transport_number)
VALUES ((SELECT id from route_seq_1 LIMIT 1), (select b.id from sillari.bridge b where b.identifier = 'T-1958'), null,
        241, 11, '2022-04-12 12:45:47.507337 +00:00', null, null, 16);
INSERT INTO sillari.route_bridge (route_id, bridge_id, crossing_instruction, contract_number, ordinal, row_created_time,
                                  row_updated_time, contract_business_id, transport_number)
VALUES ((SELECT id from route_seq_1 LIMIT 1), (select b.id from sillari.bridge b where b.identifier = 'T-1531'), null,
        236, 12, '2022-04-12 12:45:47.507337 +00:00', null, null, 16);
INSERT INTO sillari.route_bridge (route_id, bridge_id, crossing_instruction, contract_number, ordinal, row_created_time,
                                  row_updated_time, contract_business_id, transport_number)
VALUES ((SELECT id from route_seq_1 LIMIT 1), (select b.id from sillari.bridge b where b.identifier = 'V-326'), null,
        1064, 13, '2022-04-12 12:45:47.507337 +00:00', null, null, 16);
INSERT INTO sillari.route_bridge (route_id, bridge_id, crossing_instruction, contract_number, ordinal, row_created_time,
                                  row_updated_time, contract_business_id, transport_number)
VALUES ((SELECT id from route_seq_1 LIMIT 1), (select b.id from sillari.bridge b where b.identifier = 'T-1531'), null,
        236, 14, '2022-04-12 12:45:47.507337 +00:00', null, null, 16);

INSERT INTO sillari.address (id, streetaddress, row_created_time, row_updated_time)
VALUES ((SELECT id from address_seq_3 LIMIT 1), 'Messukyläntie, Tampere', '2022-04-12 12:45:47.507337 +00:00', null);
INSERT INTO sillari.address (id, streetaddress, row_created_time, row_updated_time)
VALUES ((SELECT id from address_seq_4 LIMIT 1), 'Ruutanantie, Kangasala', '2022-04-12 12:45:47.507337 +00:00', null);

INSERT INTO sillari.route (id, permit_id, name, departure_address_id, arrival_address_id, geom, lelu_id,
                           transport_count, alternative_route, row_created_time, row_updated_time)
VALUES ((SELECT id from route_seq_2 LIMIT 1), (SELECT id from permit_seq_1 LIMIT 1), '2. Tampere - Kangasala',
        (SELECT id from address_seq_3 LIMIT 1), (SELECT id from address_seq_4 LIMIT 1), null, 20308, 8, false,
        '2022-04-12 12:45:47.507337 +00:00', null);

INSERT INTO sillari.route_bridge (route_id, bridge_id, crossing_instruction, contract_number, ordinal, row_created_time,
                                  row_updated_time, contract_business_id, transport_number)
VALUES ((SELECT id from route_seq_2 LIMIT 1), (select b.id from sillari.bridge b where b.identifier = 'H-1410'), null,
        null, 1, '2022-04-12 12:45:47.507337 +00:00', null, null, 1);
INSERT INTO sillari.route_bridge (route_id, bridge_id, crossing_instruction, contract_number, ordinal, row_created_time,
                                  row_updated_time, contract_business_id, transport_number)
VALUES ((SELECT id from route_seq_2 LIMIT 1), (select b.id from sillari.bridge b where b.identifier = 'H-1410'), null,
        null, 1, '2022-04-12 12:45:47.507337 +00:00', null, null, 2);
INSERT INTO sillari.route_bridge (route_id, bridge_id, crossing_instruction, contract_number, ordinal, row_created_time,
                                  row_updated_time, contract_business_id, transport_number)
VALUES ((SELECT id from route_seq_2 LIMIT 1), (select b.id from sillari.bridge b where b.identifier = 'H-1410'), null,
        null, 1, '2022-04-12 12:45:47.507337 +00:00', null, null, 3);
INSERT INTO sillari.route_bridge (route_id, bridge_id, crossing_instruction, contract_number, ordinal, row_created_time,
                                  row_updated_time, contract_business_id, transport_number)
VALUES ((SELECT id from route_seq_2 LIMIT 1), (select b.id from sillari.bridge b where b.identifier = 'H-1410'), null,
        null, 1, '2022-04-12 12:45:47.507337 +00:00', null, null, 4);
INSERT INTO sillari.route_bridge (route_id, bridge_id, crossing_instruction, contract_number, ordinal, row_created_time,
                                  row_updated_time, contract_business_id, transport_number)
VALUES ((SELECT id from route_seq_2 LIMIT 1), (select b.id from sillari.bridge b where b.identifier = 'H-1410'), null,
        null, 1, '2022-04-12 12:45:47.507337 +00:00', null, null, 5);
INSERT INTO sillari.route_bridge (route_id, bridge_id, crossing_instruction, contract_number, ordinal, row_created_time,
                                  row_updated_time, contract_business_id, transport_number)
VALUES ((SELECT id from route_seq_2 LIMIT 1), (select b.id from sillari.bridge b where b.identifier = 'H-1410'), null,
        null, 1, '2022-04-12 12:45:47.507337 +00:00', null, null, 6);
INSERT INTO sillari.route_bridge (route_id, bridge_id, crossing_instruction, contract_number, ordinal, row_created_time,
                                  row_updated_time, contract_business_id, transport_number)
VALUES ((SELECT id from route_seq_2 LIMIT 1), (select b.id from sillari.bridge b where b.identifier = 'H-1410'), null,
        null, 1, '2022-04-12 12:45:47.507337 +00:00', null, null, 7);
INSERT INTO sillari.route_bridge (route_id, bridge_id, crossing_instruction, contract_number, ordinal, row_created_time,
                                  row_updated_time, contract_business_id, transport_number)
VALUES ((SELECT id from route_seq_2 LIMIT 1), (select b.id from sillari.bridge b where b.identifier = 'H-1410'), null,
        null, 1, '2022-04-12 12:45:47.507337 +00:00', null, null, 8);

INSERT INTO sillari.route_bridge (route_id, bridge_id, crossing_instruction, contract_number, ordinal, row_created_time,
                                  row_updated_time, contract_business_id, transport_number)
VALUES ((SELECT id from route_seq_2 LIMIT 1), (select b.id from sillari.bridge b where b.identifier = 'H-1304'), null,
        null, 2, '2022-04-12 12:45:47.507337 +00:00', null, null, 1);
INSERT INTO sillari.route_bridge (route_id, bridge_id, crossing_instruction, contract_number, ordinal, row_created_time,
                                  row_updated_time, contract_business_id, transport_number)
VALUES ((SELECT id from route_seq_2 LIMIT 1), (select b.id from sillari.bridge b where b.identifier = 'H-1304'), null,
        null, 2, '2022-04-12 12:45:47.507337 +00:00', null, null, 2);
INSERT INTO sillari.route_bridge (route_id, bridge_id, crossing_instruction, contract_number, ordinal, row_created_time,
                                  row_updated_time, contract_business_id, transport_number)
VALUES ((SELECT id from route_seq_2 LIMIT 1), (select b.id from sillari.bridge b where b.identifier = 'H-1304'), null,
        null, 2, '2022-04-12 12:45:47.507337 +00:00', null, null, 3);
INSERT INTO sillari.route_bridge (route_id, bridge_id, crossing_instruction, contract_number, ordinal, row_created_time,
                                  row_updated_time, contract_business_id, transport_number)
VALUES ((SELECT id from route_seq_2 LIMIT 1), (select b.id from sillari.bridge b where b.identifier = 'H-1304'), null,
        null, 2, '2022-04-12 12:45:47.507337 +00:00', null, null, 4);
INSERT INTO sillari.route_bridge (route_id, bridge_id, crossing_instruction, contract_number, ordinal, row_created_time,
                                  row_updated_time, contract_business_id, transport_number)
VALUES ((SELECT id from route_seq_2 LIMIT 1), (select b.id from sillari.bridge b where b.identifier = 'H-1304'), null,
        null, 2, '2022-04-12 12:45:47.507337 +00:00', null, null, 5);
INSERT INTO sillari.route_bridge (route_id, bridge_id, crossing_instruction, contract_number, ordinal, row_created_time,
                                  row_updated_time, contract_business_id, transport_number)
VALUES ((SELECT id from route_seq_2 LIMIT 1), (select b.id from sillari.bridge b where b.identifier = 'H-1304'), null,
        null, 2, '2022-04-12 12:45:47.507337 +00:00', null, null, 6);
INSERT INTO sillari.route_bridge (route_id, bridge_id, crossing_instruction, contract_number, ordinal, row_created_time,
                                  row_updated_time, contract_business_id, transport_number)
VALUES ((SELECT id from route_seq_2 LIMIT 1), (select b.id from sillari.bridge b where b.identifier = 'H-1304'), null,
        null, 2, '2022-04-12 12:45:47.507337 +00:00', null, null, 7);
INSERT INTO sillari.route_bridge (route_id, bridge_id, crossing_instruction, contract_number, ordinal, row_created_time,
                                  row_updated_time, contract_business_id, transport_number)
VALUES ((SELECT id from route_seq_2 LIMIT 1), (select b.id from sillari.bridge b where b.identifier = 'H-1304'), null,
        null, 2, '2022-04-12 12:45:47.507337 +00:00', null, null, 8);

INSERT INTO sillari.route_bridge (route_id, bridge_id, crossing_instruction, contract_number, ordinal, row_created_time,
                                  row_updated_time, contract_business_id, transport_number)
VALUES ((SELECT id from route_seq_2 LIMIT 1), (select b.id from sillari.bridge b where b.identifier = 'H-5842'), null,
        null, 3, '2022-04-12 12:45:47.507337 +00:00', null, null, 1);
INSERT INTO sillari.route_bridge (route_id, bridge_id, crossing_instruction, contract_number, ordinal, row_created_time,
                                  row_updated_time, contract_business_id, transport_number)
VALUES ((SELECT id from route_seq_2 LIMIT 1), (select b.id from sillari.bridge b where b.identifier = 'H-5842'), null,
        null, 3, '2022-04-12 12:45:47.507337 +00:00', null, null, 2);
INSERT INTO sillari.route_bridge (route_id, bridge_id, crossing_instruction, contract_number, ordinal, row_created_time,
                                  row_updated_time, contract_business_id, transport_number)
VALUES ((SELECT id from route_seq_2 LIMIT 1), (select b.id from sillari.bridge b where b.identifier = 'H-5842'), null,
        null, 3, '2022-04-12 12:45:47.507337 +00:00', null, null, 3);
INSERT INTO sillari.route_bridge (route_id, bridge_id, crossing_instruction, contract_number, ordinal, row_created_time,
                                  row_updated_time, contract_business_id, transport_number)
VALUES ((SELECT id from route_seq_2 LIMIT 1), (select b.id from sillari.bridge b where b.identifier = 'H-5842'), null,
        null, 3, '2022-04-12 12:45:47.507337 +00:00', null, null, 4);
INSERT INTO sillari.route_bridge (route_id, bridge_id, crossing_instruction, contract_number, ordinal, row_created_time,
                                  row_updated_time, contract_business_id, transport_number)
VALUES ((SELECT id from route_seq_2 LIMIT 1), (select b.id from sillari.bridge b where b.identifier = 'H-5842'), null,
        null, 3, '2022-04-12 12:45:47.507337 +00:00', null, null, 5);
INSERT INTO sillari.route_bridge (route_id, bridge_id, crossing_instruction, contract_number, ordinal, row_created_time,
                                  row_updated_time, contract_business_id, transport_number)
VALUES ((SELECT id from route_seq_2 LIMIT 1), (select b.id from sillari.bridge b where b.identifier = 'H-5842'), null,
        null, 3, '2022-04-12 12:45:47.507337 +00:00', null, null, 6);
INSERT INTO sillari.route_bridge (route_id, bridge_id, crossing_instruction, contract_number, ordinal, row_created_time,
                                  row_updated_time, contract_business_id, transport_number)
VALUES ((SELECT id from route_seq_2 LIMIT 1), (select b.id from sillari.bridge b where b.identifier = 'H-5842'), null,
        null, 3, '2022-04-12 12:45:47.507337 +00:00', null, null, 7);
INSERT INTO sillari.route_bridge (route_id, bridge_id, crossing_instruction, contract_number, ordinal, row_created_time,
                                  row_updated_time, contract_business_id, transport_number)
VALUES ((SELECT id from route_seq_2 LIMIT 1), (select b.id from sillari.bridge b where b.identifier = 'H-5842'), null,
        null, 3, '2022-04-12 12:45:47.507337 +00:00', null, null, 8);

INSERT INTO sillari.route_bridge (route_id, bridge_id, crossing_instruction, contract_number, ordinal, row_created_time,
                                  row_updated_time, contract_business_id, transport_number)
VALUES ((SELECT id from route_seq_2 LIMIT 1), (select b.id from sillari.bridge b where b.identifier = 'H-1957'), null,
        null, 4, '2022-04-12 12:45:47.507337 +00:00', null, null, 1);
INSERT INTO sillari.route_bridge (route_id, bridge_id, crossing_instruction, contract_number, ordinal, row_created_time,
                                  row_updated_time, contract_business_id, transport_number)
VALUES ((SELECT id from route_seq_2 LIMIT 1), (select b.id from sillari.bridge b where b.identifier = 'H-1957'), null,
        null, 4, '2022-04-12 12:45:47.507337 +00:00', null, null, 2);
INSERT INTO sillari.route_bridge (route_id, bridge_id, crossing_instruction, contract_number, ordinal, row_created_time,
                                  row_updated_time, contract_business_id, transport_number)
VALUES ((SELECT id from route_seq_2 LIMIT 1), (select b.id from sillari.bridge b where b.identifier = 'H-1957'), null,
        null, 4, '2022-04-12 12:45:47.507337 +00:00', null, null, 3);
INSERT INTO sillari.route_bridge (route_id, bridge_id, crossing_instruction, contract_number, ordinal, row_created_time,
                                  row_updated_time, contract_business_id, transport_number)
VALUES ((SELECT id from route_seq_2 LIMIT 1), (select b.id from sillari.bridge b where b.identifier = 'H-1957'), null,
        null, 4, '2022-04-12 12:45:47.507337 +00:00', null, null, 4);
INSERT INTO sillari.route_bridge (route_id, bridge_id, crossing_instruction, contract_number, ordinal, row_created_time,
                                  row_updated_time, contract_business_id, transport_number)
VALUES ((SELECT id from route_seq_2 LIMIT 1), (select b.id from sillari.bridge b where b.identifier = 'H-1957'), null,
        null, 4, '2022-04-12 12:45:47.507337 +00:00', null, null, 5);
INSERT INTO sillari.route_bridge (route_id, bridge_id, crossing_instruction, contract_number, ordinal, row_created_time,
                                  row_updated_time, contract_business_id, transport_number)
VALUES ((SELECT id from route_seq_2 LIMIT 1), (select b.id from sillari.bridge b where b.identifier = 'H-1957'), null,
        null, 4, '2022-04-12 12:45:47.507337 +00:00', null, null, 6);
INSERT INTO sillari.route_bridge (route_id, bridge_id, crossing_instruction, contract_number, ordinal, row_created_time,
                                  row_updated_time, contract_business_id, transport_number)
VALUES ((SELECT id from route_seq_2 LIMIT 1), (select b.id from sillari.bridge b where b.identifier = 'H-1957'), null,
        null, 4, '2022-04-12 12:45:47.507337 +00:00', null, null, 7);
INSERT INTO sillari.route_bridge (route_id, bridge_id, crossing_instruction, contract_number, ordinal, row_created_time,
                                  row_updated_time, contract_business_id, transport_number)
VALUES ((SELECT id from route_seq_2 LIMIT 1), (select b.id from sillari.bridge b where b.identifier = 'H-1957'), null,
        null, 4, '2022-04-12 12:45:47.507337 +00:00', null, null, 8);

INSERT INTO sillari.route_bridge (route_id, bridge_id, crossing_instruction, contract_number, ordinal, row_created_time,
                                  row_updated_time, contract_business_id, transport_number)
VALUES ((SELECT id from route_seq_2 LIMIT 1), (select b.id from sillari.bridge b where b.identifier = 'H-1305'), null,
        null, 5, '2022-04-12 12:45:47.507337 +00:00', null, null, 1);
INSERT INTO sillari.route_bridge (route_id, bridge_id, crossing_instruction, contract_number, ordinal, row_created_time,
                                  row_updated_time, contract_business_id, transport_number)
VALUES ((SELECT id from route_seq_2 LIMIT 1), (select b.id from sillari.bridge b where b.identifier = 'H-1305'), null,
        null, 5, '2022-04-12 12:45:47.507337 +00:00', null, null, 2);
INSERT INTO sillari.route_bridge (route_id, bridge_id, crossing_instruction, contract_number, ordinal, row_created_time,
                                  row_updated_time, contract_business_id, transport_number)
VALUES ((SELECT id from route_seq_2 LIMIT 1), (select b.id from sillari.bridge b where b.identifier = 'H-1305'), null,
        null, 5, '2022-04-12 12:45:47.507337 +00:00', null, null, 3);
INSERT INTO sillari.route_bridge (route_id, bridge_id, crossing_instruction, contract_number, ordinal, row_created_time,
                                  row_updated_time, contract_business_id, transport_number)
VALUES ((SELECT id from route_seq_2 LIMIT 1), (select b.id from sillari.bridge b where b.identifier = 'H-1305'), null,
        null, 5, '2022-04-12 12:45:47.507337 +00:00', null, null, 4);
INSERT INTO sillari.route_bridge (route_id, bridge_id, crossing_instruction, contract_number, ordinal, row_created_time,
                                  row_updated_time, contract_business_id, transport_number)
VALUES ((SELECT id from route_seq_2 LIMIT 1), (select b.id from sillari.bridge b where b.identifier = 'H-1305'), null,
        null, 5, '2022-04-12 12:45:47.507337 +00:00', null, null, 5);
INSERT INTO sillari.route_bridge (route_id, bridge_id, crossing_instruction, contract_number, ordinal, row_created_time,
                                  row_updated_time, contract_business_id, transport_number)
VALUES ((SELECT id from route_seq_2 LIMIT 1), (select b.id from sillari.bridge b where b.identifier = 'H-1305'), null,
        null, 5, '2022-04-12 12:45:47.507337 +00:00', null, null, 6);
INSERT INTO sillari.route_bridge (route_id, bridge_id, crossing_instruction, contract_number, ordinal, row_created_time,
                                  row_updated_time, contract_business_id, transport_number)
VALUES ((SELECT id from route_seq_2 LIMIT 1), (select b.id from sillari.bridge b where b.identifier = 'H-1305'), null,
        null, 5, '2022-04-12 12:45:47.507337 +00:00', null, null, 7);
INSERT INTO sillari.route_bridge (route_id, bridge_id, crossing_instruction, contract_number, ordinal, row_created_time,
                                  row_updated_time, contract_business_id, transport_number)
VALUES ((SELECT id from route_seq_2 LIMIT 1), (select b.id from sillari.bridge b where b.identifier = 'H-1305'), null,
        null, 5, '2022-04-12 12:45:47.507337 +00:00', null, null, 8);

INSERT INTO sillari.route_bridge (route_id, bridge_id, crossing_instruction, contract_number, ordinal, row_created_time,
                                  row_updated_time, contract_business_id, transport_number)
VALUES ((SELECT id from route_seq_2 LIMIT 1), (select b.id from sillari.bridge b where b.identifier = 'H-1888'), null,
        null, 6, '2022-04-12 12:45:47.507337 +00:00', null, null, 1);
INSERT INTO sillari.route_bridge (route_id, bridge_id, crossing_instruction, contract_number, ordinal, row_created_time,
                                  row_updated_time, contract_business_id, transport_number)
VALUES ((SELECT id from route_seq_2 LIMIT 1), (select b.id from sillari.bridge b where b.identifier = 'H-1888'), null,
        null, 6, '2022-04-12 12:45:47.507337 +00:00', null, null, 2);
INSERT INTO sillari.route_bridge (route_id, bridge_id, crossing_instruction, contract_number, ordinal, row_created_time,
                                  row_updated_time, contract_business_id, transport_number)
VALUES ((SELECT id from route_seq_2 LIMIT 1), (select b.id from sillari.bridge b where b.identifier = 'H-1888'), null,
        null, 6, '2022-04-12 12:45:47.507337 +00:00', null, null, 3);
INSERT INTO sillari.route_bridge (route_id, bridge_id, crossing_instruction, contract_number, ordinal, row_created_time,
                                  row_updated_time, contract_business_id, transport_number)
VALUES ((SELECT id from route_seq_2 LIMIT 1), (select b.id from sillari.bridge b where b.identifier = 'H-1888'), null,
        null, 6, '2022-04-12 12:45:47.507337 +00:00', null, null, 4);
INSERT INTO sillari.route_bridge (route_id, bridge_id, crossing_instruction, contract_number, ordinal, row_created_time,
                                  row_updated_time, contract_business_id, transport_number)
VALUES ((SELECT id from route_seq_2 LIMIT 1), (select b.id from sillari.bridge b where b.identifier = 'H-1888'), null,
        null, 6, '2022-04-12 12:45:47.507337 +00:00', null, null, 5);
INSERT INTO sillari.route_bridge (route_id, bridge_id, crossing_instruction, contract_number, ordinal, row_created_time,
                                  row_updated_time, contract_business_id, transport_number)
VALUES ((SELECT id from route_seq_2 LIMIT 1), (select b.id from sillari.bridge b where b.identifier = 'H-1888'), null,
        null, 6, '2022-04-12 12:45:47.507337 +00:00', null, null, 6);
INSERT INTO sillari.route_bridge (route_id, bridge_id, crossing_instruction, contract_number, ordinal, row_created_time,
                                  row_updated_time, contract_business_id, transport_number)
VALUES ((SELECT id from route_seq_2 LIMIT 1), (select b.id from sillari.bridge b where b.identifier = 'H-1888'), null,
        null, 6, '2022-04-12 12:45:47.507337 +00:00', null, null, 7);
INSERT INTO sillari.route_bridge (route_id, bridge_id, crossing_instruction, contract_number, ordinal, row_created_time,
                                  row_updated_time, contract_business_id, transport_number)
VALUES ((SELECT id from route_seq_2 LIMIT 1), (select b.id from sillari.bridge b where b.identifier = 'H-1888'), null,
        null, 6, '2022-04-12 12:45:47.507337 +00:00', null, null, 8);

INSERT INTO sillari.route_bridge (route_id, bridge_id, crossing_instruction, contract_number, ordinal, row_created_time,
                                  row_updated_time, contract_business_id, transport_number)
VALUES ((SELECT id from route_seq_2 LIMIT 1), (select b.id from sillari.bridge b where b.identifier = 'H-1325'), null,
        null, 7, '2022-04-12 12:45:47.507337 +00:00', null, null, 1);
INSERT INTO sillari.route_bridge (route_id, bridge_id, crossing_instruction, contract_number, ordinal, row_created_time,
                                  row_updated_time, contract_business_id, transport_number)
VALUES ((SELECT id from route_seq_2 LIMIT 1), (select b.id from sillari.bridge b where b.identifier = 'H-1325'), null,
        null, 7, '2022-04-12 12:45:47.507337 +00:00', null, null, 2);
INSERT INTO sillari.route_bridge (route_id, bridge_id, crossing_instruction, contract_number, ordinal, row_created_time,
                                  row_updated_time, contract_business_id, transport_number)
VALUES ((SELECT id from route_seq_2 LIMIT 1), (select b.id from sillari.bridge b where b.identifier = 'H-1325'), null,
        null, 7, '2022-04-12 12:45:47.507337 +00:00', null, null, 3);
INSERT INTO sillari.route_bridge (route_id, bridge_id, crossing_instruction, contract_number, ordinal, row_created_time,
                                  row_updated_time, contract_business_id, transport_number)
VALUES ((SELECT id from route_seq_2 LIMIT 1), (select b.id from sillari.bridge b where b.identifier = 'H-1325'), null,
        null, 7, '2022-04-12 12:45:47.507337 +00:00', null, null, 4);
INSERT INTO sillari.route_bridge (route_id, bridge_id, crossing_instruction, contract_number, ordinal, row_created_time,
                                  row_updated_time, contract_business_id, transport_number)
VALUES ((SELECT id from route_seq_2 LIMIT 1), (select b.id from sillari.bridge b where b.identifier = 'H-1325'), null,
        null, 7, '2022-04-12 12:45:47.507337 +00:00', null, null, 5);
INSERT INTO sillari.route_bridge (route_id, bridge_id, crossing_instruction, contract_number, ordinal, row_created_time,
                                  row_updated_time, contract_business_id, transport_number)
VALUES ((SELECT id from route_seq_2 LIMIT 1), (select b.id from sillari.bridge b where b.identifier = 'H-1325'), null,
        null, 7, '2022-04-12 12:45:47.507337 +00:00', null, null, 6);
INSERT INTO sillari.route_bridge (route_id, bridge_id, crossing_instruction, contract_number, ordinal, row_created_time,
                                  row_updated_time, contract_business_id, transport_number)
VALUES ((SELECT id from route_seq_2 LIMIT 1), (select b.id from sillari.bridge b where b.identifier = 'H-1325'), null,
        null, 7, '2022-04-12 12:45:47.507337 +00:00', null, null, 7);
INSERT INTO sillari.route_bridge (route_id, bridge_id, crossing_instruction, contract_number, ordinal, row_created_time,
                                  row_updated_time, contract_business_id, transport_number)
VALUES ((SELECT id from route_seq_2 LIMIT 1), (select b.id from sillari.bridge b where b.identifier = 'H-1325'), null,
        null, 7, '2022-04-12 12:45:47.507337 +00:00', null, null, 8);

INSERT INTO sillari.route_bridge (route_id, bridge_id, crossing_instruction, contract_number, ordinal, row_created_time,
                                  row_updated_time, contract_business_id, transport_number)
VALUES ((SELECT id from route_seq_2 LIMIT 1), (select b.id from sillari.bridge b where b.identifier = 'H-1327'), null,
        null, 8, '2022-04-12 12:45:47.507337 +00:00', null, null, 1);
INSERT INTO sillari.route_bridge (route_id, bridge_id, crossing_instruction, contract_number, ordinal, row_created_time,
                                  row_updated_time, contract_business_id, transport_number)
VALUES ((SELECT id from route_seq_2 LIMIT 1), (select b.id from sillari.bridge b where b.identifier = 'H-1327'), null,
        null, 8, '2022-04-12 12:45:47.507337 +00:00', null, null, 2);
INSERT INTO sillari.route_bridge (route_id, bridge_id, crossing_instruction, contract_number, ordinal, row_created_time,
                                  row_updated_time, contract_business_id, transport_number)
VALUES ((SELECT id from route_seq_2 LIMIT 1), (select b.id from sillari.bridge b where b.identifier = 'H-1327'), null,
        null, 8, '2022-04-12 12:45:47.507337 +00:00', null, null, 3);
INSERT INTO sillari.route_bridge (route_id, bridge_id, crossing_instruction, contract_number, ordinal, row_created_time,
                                  row_updated_time, contract_business_id, transport_number)
VALUES ((SELECT id from route_seq_2 LIMIT 1), (select b.id from sillari.bridge b where b.identifier = 'H-1327'), null,
        null, 8, '2022-04-12 12:45:47.507337 +00:00', null, null, 4);
INSERT INTO sillari.route_bridge (route_id, bridge_id, crossing_instruction, contract_number, ordinal, row_created_time,
                                  row_updated_time, contract_business_id, transport_number)
VALUES ((SELECT id from route_seq_2 LIMIT 1), (select b.id from sillari.bridge b where b.identifier = 'H-1327'), null,
        null, 8, '2022-04-12 12:45:47.507337 +00:00', null, null, 5);
INSERT INTO sillari.route_bridge (route_id, bridge_id, crossing_instruction, contract_number, ordinal, row_created_time,
                                  row_updated_time, contract_business_id, transport_number)
VALUES ((SELECT id from route_seq_2 LIMIT 1), (select b.id from sillari.bridge b where b.identifier = 'H-1327'), null,
        null, 8, '2022-04-12 12:45:47.507337 +00:00', null, null, 6);
INSERT INTO sillari.route_bridge (route_id, bridge_id, crossing_instruction, contract_number, ordinal, row_created_time,
                                  row_updated_time, contract_business_id, transport_number)
VALUES ((SELECT id from route_seq_2 LIMIT 1), (select b.id from sillari.bridge b where b.identifier = 'H-1327'), null,
        null, 8, '2022-04-12 12:45:47.507337 +00:00', null, null, 7);
INSERT INTO sillari.route_bridge (route_id, bridge_id, crossing_instruction, contract_number, ordinal, row_created_time,
                                  row_updated_time, contract_business_id, transport_number)
VALUES ((SELECT id from route_seq_2 LIMIT 1), (select b.id from sillari.bridge b where b.identifier = 'H-1327'), null,
        null, 8, '2022-04-12 12:45:47.507337 +00:00', null, null, 8);

INSERT INTO sillari.route_bridge (route_id, bridge_id, crossing_instruction, contract_number, ordinal, row_created_time,
                                  row_updated_time, contract_business_id, transport_number)
VALUES ((SELECT id from route_seq_2 LIMIT 1), (select b.id from sillari.bridge b where b.identifier = 'H-1326'), null,
        null, 9, '2022-04-12 12:45:47.507337 +00:00', null, null, 1);
INSERT INTO sillari.route_bridge (route_id, bridge_id, crossing_instruction, contract_number, ordinal, row_created_time,
                                  row_updated_time, contract_business_id, transport_number)
VALUES ((SELECT id from route_seq_2 LIMIT 1), (select b.id from sillari.bridge b where b.identifier = 'H-1326'), null,
        null, 9, '2022-04-12 12:45:47.507337 +00:00', null, null, 2);
INSERT INTO sillari.route_bridge (route_id, bridge_id, crossing_instruction, contract_number, ordinal, row_created_time,
                                  row_updated_time, contract_business_id, transport_number)
VALUES ((SELECT id from route_seq_2 LIMIT 1), (select b.id from sillari.bridge b where b.identifier = 'H-1326'), null,
        null, 9, '2022-04-12 12:45:47.507337 +00:00', null, null, 3);
INSERT INTO sillari.route_bridge (route_id, bridge_id, crossing_instruction, contract_number, ordinal, row_created_time,
                                  row_updated_time, contract_business_id, transport_number)
VALUES ((SELECT id from route_seq_2 LIMIT 1), (select b.id from sillari.bridge b where b.identifier = 'H-1326'), null,
        null, 9, '2022-04-12 12:45:47.507337 +00:00', null, null, 4);
INSERT INTO sillari.route_bridge (route_id, bridge_id, crossing_instruction, contract_number, ordinal, row_created_time,
                                  row_updated_time, contract_business_id, transport_number)
VALUES ((SELECT id from route_seq_2 LIMIT 1), (select b.id from sillari.bridge b where b.identifier = 'H-1326'), null,
        null, 9, '2022-04-12 12:45:47.507337 +00:00', null, null, 5);
INSERT INTO sillari.route_bridge (route_id, bridge_id, crossing_instruction, contract_number, ordinal, row_created_time,
                                  row_updated_time, contract_business_id, transport_number)
VALUES ((SELECT id from route_seq_2 LIMIT 1), (select b.id from sillari.bridge b where b.identifier = 'H-1326'), null,
        null, 9, '2022-04-12 12:45:47.507337 +00:00', null, null, 6);
INSERT INTO sillari.route_bridge (route_id, bridge_id, crossing_instruction, contract_number, ordinal, row_created_time,
                                  row_updated_time, contract_business_id, transport_number)
VALUES ((SELECT id from route_seq_2 LIMIT 1), (select b.id from sillari.bridge b where b.identifier = 'H-1326'), null,
        null, 9, '2022-04-12 12:45:47.507337 +00:00', null, null, 7);
INSERT INTO sillari.route_bridge (route_id, bridge_id, crossing_instruction, contract_number, ordinal, row_created_time,
                                  row_updated_time, contract_business_id, transport_number)
VALUES ((SELECT id from route_seq_2 LIMIT 1), (select b.id from sillari.bridge b where b.identifier = 'H-1326'), null,
        null, 9, '2022-04-12 12:45:47.507337 +00:00', null, null, 8);

INSERT INTO sillari.route_bridge (route_id, bridge_id, crossing_instruction, contract_number, ordinal, row_created_time,
                                  row_updated_time, contract_business_id, transport_number)
VALUES ((SELECT id from route_seq_2 LIMIT 1), (select b.id from sillari.bridge b where b.identifier = 'H-1185'), null,
        null, 10, '2022-04-12 12:45:47.507337 +00:00', null, null, 1);
INSERT INTO sillari.route_bridge (route_id, bridge_id, crossing_instruction, contract_number, ordinal, row_created_time,
                                  row_updated_time, contract_business_id, transport_number)
VALUES ((SELECT id from route_seq_2 LIMIT 1), (select b.id from sillari.bridge b where b.identifier = 'H-1185'), null,
        null, 10, '2022-04-12 12:45:47.507337 +00:00', null, null, 2);
INSERT INTO sillari.route_bridge (route_id, bridge_id, crossing_instruction, contract_number, ordinal, row_created_time,
                                  row_updated_time, contract_business_id, transport_number)
VALUES ((SELECT id from route_seq_2 LIMIT 1), (select b.id from sillari.bridge b where b.identifier = 'H-1185'), null,
        null, 10, '2022-04-12 12:45:47.507337 +00:00', null, null, 3);
INSERT INTO sillari.route_bridge (route_id, bridge_id, crossing_instruction, contract_number, ordinal, row_created_time,
                                  row_updated_time, contract_business_id, transport_number)
VALUES ((SELECT id from route_seq_2 LIMIT 1), (select b.id from sillari.bridge b where b.identifier = 'H-1185'), null,
        null, 10, '2022-04-12 12:45:47.507337 +00:00', null, null, 4);
INSERT INTO sillari.route_bridge (route_id, bridge_id, crossing_instruction, contract_number, ordinal, row_created_time,
                                  row_updated_time, contract_business_id, transport_number)
VALUES ((SELECT id from route_seq_2 LIMIT 1), (select b.id from sillari.bridge b where b.identifier = 'H-1185'), null,
        null, 10, '2022-04-12 12:45:47.507337 +00:00', null, null, 5);
INSERT INTO sillari.route_bridge (route_id, bridge_id, crossing_instruction, contract_number, ordinal, row_created_time,
                                  row_updated_time, contract_business_id, transport_number)
VALUES ((SELECT id from route_seq_2 LIMIT 1), (select b.id from sillari.bridge b where b.identifier = 'H-1185'), null,
        null, 10, '2022-04-12 12:45:47.507337 +00:00', null, null, 6);
INSERT INTO sillari.route_bridge (route_id, bridge_id, crossing_instruction, contract_number, ordinal, row_created_time,
                                  row_updated_time, contract_business_id, transport_number)
VALUES ((SELECT id from route_seq_2 LIMIT 1), (select b.id from sillari.bridge b where b.identifier = 'H-1185'), null,
        null, 10, '2022-04-12 12:45:47.507337 +00:00', null, null, 7);
INSERT INTO sillari.route_bridge (route_id, bridge_id, crossing_instruction, contract_number, ordinal, row_created_time,
                                  row_updated_time, contract_business_id, transport_number)
VALUES ((SELECT id from route_seq_2 LIMIT 1), (select b.id from sillari.bridge b where b.identifier = 'H-1185'), null,
        null, 10, '2022-04-12 12:45:47.507337 +00:00', null, null, 8);

INSERT INTO sillari.route_bridge (route_id, bridge_id, crossing_instruction, contract_number, ordinal, row_created_time,
                                  row_updated_time, contract_business_id, transport_number)
VALUES ((SELECT id from route_seq_2 LIMIT 1), (select b.id from sillari.bridge b where b.identifier = 'H-1519'), null,
        null, 11, '2022-04-12 12:45:47.507337 +00:00', null, null, 1);
INSERT INTO sillari.route_bridge (route_id, bridge_id, crossing_instruction, contract_number, ordinal, row_created_time,
                                  row_updated_time, contract_business_id, transport_number)
VALUES ((SELECT id from route_seq_2 LIMIT 1), (select b.id from sillari.bridge b where b.identifier = 'H-1519'), null,
        null, 11, '2022-04-12 12:45:47.507337 +00:00', null, null, 2);
INSERT INTO sillari.route_bridge (route_id, bridge_id, crossing_instruction, contract_number, ordinal, row_created_time,
                                  row_updated_time, contract_business_id, transport_number)
VALUES ((SELECT id from route_seq_2 LIMIT 1), (select b.id from sillari.bridge b where b.identifier = 'H-1519'), null,
        null, 11, '2022-04-12 12:45:47.507337 +00:00', null, null, 3);
INSERT INTO sillari.route_bridge (route_id, bridge_id, crossing_instruction, contract_number, ordinal, row_created_time,
                                  row_updated_time, contract_business_id, transport_number)
VALUES ((SELECT id from route_seq_2 LIMIT 1), (select b.id from sillari.bridge b where b.identifier = 'H-1519'), null,
        null, 11, '2022-04-12 12:45:47.507337 +00:00', null, null, 4);
INSERT INTO sillari.route_bridge (route_id, bridge_id, crossing_instruction, contract_number, ordinal, row_created_time,
                                  row_updated_time, contract_business_id, transport_number)
VALUES ((SELECT id from route_seq_2 LIMIT 1), (select b.id from sillari.bridge b where b.identifier = 'H-1519'), null,
        null, 11, '2022-04-12 12:45:47.507337 +00:00', null, null, 5);
INSERT INTO sillari.route_bridge (route_id, bridge_id, crossing_instruction, contract_number, ordinal, row_created_time,
                                  row_updated_time, contract_business_id, transport_number)
VALUES ((SELECT id from route_seq_2 LIMIT 1), (select b.id from sillari.bridge b where b.identifier = 'H-1519'), null,
        null, 11, '2022-04-12 12:45:47.507337 +00:00', null, null, 6);
INSERT INTO sillari.route_bridge (route_id, bridge_id, crossing_instruction, contract_number, ordinal, row_created_time,
                                  row_updated_time, contract_business_id, transport_number)
VALUES ((SELECT id from route_seq_2 LIMIT 1), (select b.id from sillari.bridge b where b.identifier = 'H-1519'), null,
        null, 11, '2022-04-12 12:45:47.507337 +00:00', null, null, 7);
INSERT INTO sillari.route_bridge (route_id, bridge_id, crossing_instruction, contract_number, ordinal, row_created_time,
                                  row_updated_time, contract_business_id, transport_number)
VALUES ((SELECT id from route_seq_2 LIMIT 1), (select b.id from sillari.bridge b where b.identifier = 'H-1519'), null,
        null, 11, '2022-04-12 12:45:47.507337 +00:00', null, null, 8);

INSERT INTO sillari.route_bridge (route_id, bridge_id, crossing_instruction, contract_number, ordinal, row_created_time,
                                  row_updated_time, contract_business_id, transport_number)
VALUES ((SELECT id from route_seq_2 LIMIT 1), (select b.id from sillari.bridge b where b.identifier = 'H-1168'), null,
        null, 12, '2022-04-12 12:45:47.507337 +00:00', null, null, 1);
INSERT INTO sillari.route_bridge (route_id, bridge_id, crossing_instruction, contract_number, ordinal, row_created_time,
                                  row_updated_time, contract_business_id, transport_number)
VALUES ((SELECT id from route_seq_2 LIMIT 1), (select b.id from sillari.bridge b where b.identifier = 'H-1168'), null,
        null, 12, '2022-04-12 12:45:47.507337 +00:00', null, null, 2);
INSERT INTO sillari.route_bridge (route_id, bridge_id, crossing_instruction, contract_number, ordinal, row_created_time,
                                  row_updated_time, contract_business_id, transport_number)
VALUES ((SELECT id from route_seq_2 LIMIT 1), (select b.id from sillari.bridge b where b.identifier = 'H-1168'), null,
        null, 12, '2022-04-12 12:45:47.507337 +00:00', null, null, 3);
INSERT INTO sillari.route_bridge (route_id, bridge_id, crossing_instruction, contract_number, ordinal, row_created_time,
                                  row_updated_time, contract_business_id, transport_number)
VALUES ((SELECT id from route_seq_2 LIMIT 1), (select b.id from sillari.bridge b where b.identifier = 'H-1168'), null,
        null, 12, '2022-04-12 12:45:47.507337 +00:00', null, null, 4);
INSERT INTO sillari.route_bridge (route_id, bridge_id, crossing_instruction, contract_number, ordinal, row_created_time,
                                  row_updated_time, contract_business_id, transport_number)
VALUES ((SELECT id from route_seq_2 LIMIT 1), (select b.id from sillari.bridge b where b.identifier = 'H-1168'), null,
        null, 12, '2022-04-12 12:45:47.507337 +00:00', null, null, 5);
INSERT INTO sillari.route_bridge (route_id, bridge_id, crossing_instruction, contract_number, ordinal, row_created_time,
                                  row_updated_time, contract_business_id, transport_number)
VALUES ((SELECT id from route_seq_2 LIMIT 1), (select b.id from sillari.bridge b where b.identifier = 'H-1168'), null,
        null, 12, '2022-04-12 12:45:47.507337 +00:00', null, null, 6);
INSERT INTO sillari.route_bridge (route_id, bridge_id, crossing_instruction, contract_number, ordinal, row_created_time,
                                  row_updated_time, contract_business_id, transport_number)
VALUES ((SELECT id from route_seq_2 LIMIT 1), (select b.id from sillari.bridge b where b.identifier = 'H-1168'), null,
        null, 12, '2022-04-12 12:45:47.507337 +00:00', null, null, 7);
INSERT INTO sillari.route_bridge (route_id, bridge_id, crossing_instruction, contract_number, ordinal, row_created_time,
                                  row_updated_time, contract_business_id, transport_number)
VALUES ((SELECT id from route_seq_2 LIMIT 1), (select b.id from sillari.bridge b where b.identifier = 'H-1168'), null,
        null, 12, '2022-04-12 12:45:47.507337 +00:00', null, null, 8);

INSERT INTO sillari.route_bridge (route_id, bridge_id, crossing_instruction, contract_number, ordinal, row_created_time,
                                  row_updated_time, contract_business_id, transport_number)
VALUES ((SELECT id from route_seq_2 LIMIT 1), (select b.id from sillari.bridge b where b.identifier = 'H-5195'), null,
        null, 13, '2022-04-12 12:45:47.507337 +00:00', null, null, 1);
INSERT INTO sillari.route_bridge (route_id, bridge_id, crossing_instruction, contract_number, ordinal, row_created_time,
                                  row_updated_time, contract_business_id, transport_number)
VALUES ((SELECT id from route_seq_2 LIMIT 1), (select b.id from sillari.bridge b where b.identifier = 'H-5195'), null,
        null, 13, '2022-04-12 12:45:47.507337 +00:00', null, null, 2);
INSERT INTO sillari.route_bridge (route_id, bridge_id, crossing_instruction, contract_number, ordinal, row_created_time,
                                  row_updated_time, contract_business_id, transport_number)
VALUES ((SELECT id from route_seq_2 LIMIT 1), (select b.id from sillari.bridge b where b.identifier = 'H-5195'), null,
        null, 13, '2022-04-12 12:45:47.507337 +00:00', null, null, 3);
INSERT INTO sillari.route_bridge (route_id, bridge_id, crossing_instruction, contract_number, ordinal, row_created_time,
                                  row_updated_time, contract_business_id, transport_number)
VALUES ((SELECT id from route_seq_2 LIMIT 1), (select b.id from sillari.bridge b where b.identifier = 'H-5195'), null,
        null, 13, '2022-04-12 12:45:47.507337 +00:00', null, null, 4);
INSERT INTO sillari.route_bridge (route_id, bridge_id, crossing_instruction, contract_number, ordinal, row_created_time,
                                  row_updated_time, contract_business_id, transport_number)
VALUES ((SELECT id from route_seq_2 LIMIT 1), (select b.id from sillari.bridge b where b.identifier = 'H-5195'), null,
        null, 13, '2022-04-12 12:45:47.507337 +00:00', null, null, 5);
INSERT INTO sillari.route_bridge (route_id, bridge_id, crossing_instruction, contract_number, ordinal, row_created_time,
                                  row_updated_time, contract_business_id, transport_number)
VALUES ((SELECT id from route_seq_2 LIMIT 1), (select b.id from sillari.bridge b where b.identifier = 'H-5195'), null,
        null, 13, '2022-04-12 12:45:47.507337 +00:00', null, null, 6);
INSERT INTO sillari.route_bridge (route_id, bridge_id, crossing_instruction, contract_number, ordinal, row_created_time,
                                  row_updated_time, contract_business_id, transport_number)
VALUES ((SELECT id from route_seq_2 LIMIT 1), (select b.id from sillari.bridge b where b.identifier = 'H-5195'), null,
        null, 13, '2022-04-12 12:45:47.507337 +00:00', null, null, 7);
INSERT INTO sillari.route_bridge (route_id, bridge_id, crossing_instruction, contract_number, ordinal, row_created_time,
                                  row_updated_time, contract_business_id, transport_number)
VALUES ((SELECT id from route_seq_2 LIMIT 1), (select b.id from sillari.bridge b where b.identifier = 'H-5195'), null,
        null, 13, '2022-04-12 12:45:47.507337 +00:00', null, null, 8);

INSERT INTO sillari.route_bridge (route_id, bridge_id, crossing_instruction, contract_number, ordinal, row_created_time,
                                  row_updated_time, contract_business_id, transport_number)
VALUES ((SELECT id from route_seq_2 LIMIT 1), (select b.id from sillari.bridge b where b.identifier = 'H-1159'), null,
        null, 14, '2022-04-12 12:45:47.507337 +00:00', null, null, 1);
INSERT INTO sillari.route_bridge (route_id, bridge_id, crossing_instruction, contract_number, ordinal, row_created_time,
                                  row_updated_time, contract_business_id, transport_number)
VALUES ((SELECT id from route_seq_2 LIMIT 1), (select b.id from sillari.bridge b where b.identifier = 'H-1159'), null,
        null, 14, '2022-04-12 12:45:47.507337 +00:00', null, null, 2);
INSERT INTO sillari.route_bridge (route_id, bridge_id, crossing_instruction, contract_number, ordinal, row_created_time,
                                  row_updated_time, contract_business_id, transport_number)
VALUES ((SELECT id from route_seq_2 LIMIT 1), (select b.id from sillari.bridge b where b.identifier = 'H-1159'), null,
        null, 14, '2022-04-12 12:45:47.507337 +00:00', null, null, 3);
INSERT INTO sillari.route_bridge (route_id, bridge_id, crossing_instruction, contract_number, ordinal, row_created_time,
                                  row_updated_time, contract_business_id, transport_number)
VALUES ((SELECT id from route_seq_2 LIMIT 1), (select b.id from sillari.bridge b where b.identifier = 'H-1159'), null,
        null, 14, '2022-04-12 12:45:47.507337 +00:00', null, null, 4);
INSERT INTO sillari.route_bridge (route_id, bridge_id, crossing_instruction, contract_number, ordinal, row_created_time,
                                  row_updated_time, contract_business_id, transport_number)
VALUES ((SELECT id from route_seq_2 LIMIT 1), (select b.id from sillari.bridge b where b.identifier = 'H-1159'), null,
        null, 14, '2022-04-12 12:45:47.507337 +00:00', null, null, 5);
INSERT INTO sillari.route_bridge (route_id, bridge_id, crossing_instruction, contract_number, ordinal, row_created_time,
                                  row_updated_time, contract_business_id, transport_number)
VALUES ((SELECT id from route_seq_2 LIMIT 1), (select b.id from sillari.bridge b where b.identifier = 'H-1159'), null,
        null, 14, '2022-04-12 12:45:47.507337 +00:00', null, null, 6);
INSERT INTO sillari.route_bridge (route_id, bridge_id, crossing_instruction, contract_number, ordinal, row_created_time,
                                  row_updated_time, contract_business_id, transport_number)
VALUES ((SELECT id from route_seq_2 LIMIT 1), (select b.id from sillari.bridge b where b.identifier = 'H-1159'), null,
        null, 14, '2022-04-12 12:45:47.507337 +00:00', null, null, 7);
INSERT INTO sillari.route_bridge (route_id, bridge_id, crossing_instruction, contract_number, ordinal, row_created_time,
                                  row_updated_time, contract_business_id, transport_number)
VALUES ((SELECT id from route_seq_2 LIMIT 1), (select b.id from sillari.bridge b where b.identifier = 'H-1159'), null,
        null, 14, '2022-04-12 12:45:47.507337 +00:00', null, null, 8);

INSERT INTO sillari.route_bridge (route_id, bridge_id, crossing_instruction, contract_number, ordinal, row_created_time,
                                  row_updated_time, contract_business_id, transport_number)
VALUES ((SELECT id from route_seq_2 LIMIT 1), (select b.id from sillari.bridge b where b.identifier = 'H-5196'), null,
        null, 15, '2022-04-12 12:45:47.507337 +00:00', null, null, 1);
INSERT INTO sillari.route_bridge (route_id, bridge_id, crossing_instruction, contract_number, ordinal, row_created_time,
                                  row_updated_time, contract_business_id, transport_number)
VALUES ((SELECT id from route_seq_2 LIMIT 1), (select b.id from sillari.bridge b where b.identifier = 'H-5196'), null,
        null, 15, '2022-04-12 12:45:47.507337 +00:00', null, null, 2);
INSERT INTO sillari.route_bridge (route_id, bridge_id, crossing_instruction, contract_number, ordinal, row_created_time,
                                  row_updated_time, contract_business_id, transport_number)
VALUES ((SELECT id from route_seq_2 LIMIT 1), (select b.id from sillari.bridge b where b.identifier = 'H-5196'), null,
        null, 15, '2022-04-12 12:45:47.507337 +00:00', null, null, 3);
INSERT INTO sillari.route_bridge (route_id, bridge_id, crossing_instruction, contract_number, ordinal, row_created_time,
                                  row_updated_time, contract_business_id, transport_number)
VALUES ((SELECT id from route_seq_2 LIMIT 1), (select b.id from sillari.bridge b where b.identifier = 'H-5196'), null,
        null, 15, '2022-04-12 12:45:47.507337 +00:00', null, null, 4);
INSERT INTO sillari.route_bridge (route_id, bridge_id, crossing_instruction, contract_number, ordinal, row_created_time,
                                  row_updated_time, contract_business_id, transport_number)
VALUES ((SELECT id from route_seq_2 LIMIT 1), (select b.id from sillari.bridge b where b.identifier = 'H-5196'), null,
        null, 15, '2022-04-12 12:45:47.507337 +00:00', null, null, 5);
INSERT INTO sillari.route_bridge (route_id, bridge_id, crossing_instruction, contract_number, ordinal, row_created_time,
                                  row_updated_time, contract_business_id, transport_number)
VALUES ((SELECT id from route_seq_2 LIMIT 1), (select b.id from sillari.bridge b where b.identifier = 'H-5196'), null,
        null, 15, '2022-04-12 12:45:47.507337 +00:00', null, null, 6);
INSERT INTO sillari.route_bridge (route_id, bridge_id, crossing_instruction, contract_number, ordinal, row_created_time,
                                  row_updated_time, contract_business_id, transport_number)
VALUES ((SELECT id from route_seq_2 LIMIT 1), (select b.id from sillari.bridge b where b.identifier = 'H-5196'), null,
        null, 15, '2022-04-12 12:45:47.507337 +00:00', null, null, 7);
INSERT INTO sillari.route_bridge (route_id, bridge_id, crossing_instruction, contract_number, ordinal, row_created_time,
                                  row_updated_time, contract_business_id, transport_number)
VALUES ((SELECT id from route_seq_2 LIMIT 1), (select b.id from sillari.bridge b where b.identifier = 'H-5196'), null,
        null, 15, '2022-04-12 12:45:47.507337 +00:00', null, null, 8);

INSERT INTO sillari.route_bridge (route_id, bridge_id, crossing_instruction, contract_number, ordinal, row_created_time,
                                  row_updated_time, contract_business_id, transport_number)
VALUES ((SELECT id from route_seq_2 LIMIT 1), (select b.id from sillari.bridge b where b.identifier = 'H-5197'), null,
        null, 16, '2022-04-12 12:45:47.507337 +00:00', null, null, 1);
INSERT INTO sillari.route_bridge (route_id, bridge_id, crossing_instruction, contract_number, ordinal, row_created_time,
                                  row_updated_time, contract_business_id, transport_number)
VALUES ((SELECT id from route_seq_2 LIMIT 1), (select b.id from sillari.bridge b where b.identifier = 'H-5197'), null,
        null, 16, '2022-04-12 12:45:47.507337 +00:00', null, null, 2);
INSERT INTO sillari.route_bridge (route_id, bridge_id, crossing_instruction, contract_number, ordinal, row_created_time,
                                  row_updated_time, contract_business_id, transport_number)
VALUES ((SELECT id from route_seq_2 LIMIT 1), (select b.id from sillari.bridge b where b.identifier = 'H-5197'), null,
        null, 16, '2022-04-12 12:45:47.507337 +00:00', null, null, 3);
INSERT INTO sillari.route_bridge (route_id, bridge_id, crossing_instruction, contract_number, ordinal, row_created_time,
                                  row_updated_time, contract_business_id, transport_number)
VALUES ((SELECT id from route_seq_2 LIMIT 1), (select b.id from sillari.bridge b where b.identifier = 'H-5197'), null,
        null, 16, '2022-04-12 12:45:47.507337 +00:00', null, null, 4);
INSERT INTO sillari.route_bridge (route_id, bridge_id, crossing_instruction, contract_number, ordinal, row_created_time,
                                  row_updated_time, contract_business_id, transport_number)
VALUES ((SELECT id from route_seq_2 LIMIT 1), (select b.id from sillari.bridge b where b.identifier = 'H-5197'), null,
        null, 16, '2022-04-12 12:45:47.507337 +00:00', null, null, 5);
INSERT INTO sillari.route_bridge (route_id, bridge_id, crossing_instruction, contract_number, ordinal, row_created_time,
                                  row_updated_time, contract_business_id, transport_number)
VALUES ((SELECT id from route_seq_2 LIMIT 1), (select b.id from sillari.bridge b where b.identifier = 'H-5197'), null,
        null, 16, '2022-04-12 12:45:47.507337 +00:00', null, null, 6);
INSERT INTO sillari.route_bridge (route_id, bridge_id, crossing_instruction, contract_number, ordinal, row_created_time,
                                  row_updated_time, contract_business_id, transport_number)
VALUES ((SELECT id from route_seq_2 LIMIT 1), (select b.id from sillari.bridge b where b.identifier = 'H-5197'), null,
        null, 16, '2022-04-12 12:45:47.507337 +00:00', null, null, 7);
INSERT INTO sillari.route_bridge (route_id, bridge_id, crossing_instruction, contract_number, ordinal, row_created_time,
                                  row_updated_time, contract_business_id, transport_number)
VALUES ((SELECT id from route_seq_2 LIMIT 1), (select b.id from sillari.bridge b where b.identifier = 'H-5197'), null,
        null, 16, '2022-04-12 12:45:47.507337 +00:00', null, null, 8);

INSERT INTO sillari.route_bridge (route_id, bridge_id, crossing_instruction, contract_number, ordinal, row_created_time,
                                  row_updated_time, contract_business_id, transport_number)
VALUES ((SELECT id from route_seq_2 LIMIT 1), (select b.id from sillari.bridge b where b.identifier = 'H-1165'), null,
        null, 17, '2022-04-12 12:45:47.507337 +00:00', null, null, 1);
INSERT INTO sillari.route_bridge (route_id, bridge_id, crossing_instruction, contract_number, ordinal, row_created_time,
                                  row_updated_time, contract_business_id, transport_number)
VALUES ((SELECT id from route_seq_2 LIMIT 1), (select b.id from sillari.bridge b where b.identifier = 'H-1165'), null,
        null, 17, '2022-04-12 12:45:47.507337 +00:00', null, null, 2);
INSERT INTO sillari.route_bridge (route_id, bridge_id, crossing_instruction, contract_number, ordinal, row_created_time,
                                  row_updated_time, contract_business_id, transport_number)
VALUES ((SELECT id from route_seq_2 LIMIT 1), (select b.id from sillari.bridge b where b.identifier = 'H-1165'), null,
        null, 17, '2022-04-12 12:45:47.507337 +00:00', null, null, 3);
INSERT INTO sillari.route_bridge (route_id, bridge_id, crossing_instruction, contract_number, ordinal, row_created_time,
                                  row_updated_time, contract_business_id, transport_number)
VALUES ((SELECT id from route_seq_2 LIMIT 1), (select b.id from sillari.bridge b where b.identifier = 'H-1165'), null,
        null, 17, '2022-04-12 12:45:47.507337 +00:00', null, null, 4);
INSERT INTO sillari.route_bridge (route_id, bridge_id, crossing_instruction, contract_number, ordinal, row_created_time,
                                  row_updated_time, contract_business_id, transport_number)
VALUES ((SELECT id from route_seq_2 LIMIT 1), (select b.id from sillari.bridge b where b.identifier = 'H-1165'), null,
        null, 17, '2022-04-12 12:45:47.507337 +00:00', null, null, 5);
INSERT INTO sillari.route_bridge (route_id, bridge_id, crossing_instruction, contract_number, ordinal, row_created_time,
                                  row_updated_time, contract_business_id, transport_number)
VALUES ((SELECT id from route_seq_2 LIMIT 1), (select b.id from sillari.bridge b where b.identifier = 'H-1165'), null,
        null, 17, '2022-04-12 12:45:47.507337 +00:00', null, null, 6);
INSERT INTO sillari.route_bridge (route_id, bridge_id, crossing_instruction, contract_number, ordinal, row_created_time,
                                  row_updated_time, contract_business_id, transport_number)
VALUES ((SELECT id from route_seq_2 LIMIT 1), (select b.id from sillari.bridge b where b.identifier = 'H-1165'), null,
        null, 17, '2022-04-12 12:45:47.507337 +00:00', null, null, 7);
INSERT INTO sillari.route_bridge (route_id, bridge_id, crossing_instruction, contract_number, ordinal, row_created_time,
                                  row_updated_time, contract_business_id, transport_number)
VALUES ((SELECT id from route_seq_2 LIMIT 1), (select b.id from sillari.bridge b where b.identifier = 'H-1165'), null,
        null, 17, '2022-04-12 12:45:47.507337 +00:00', null, null, 8);

DROP TABLE address_seq_1;
DROP TABLE address_seq_2;
DROP TABLE address_seq_3;
DROP TABLE address_seq_4;
DROP TABLE permit_seq_1;
DROP TABLE axle_chart_seq_1;
DROP TABLE route_seq_1;
DROP TABLE route_seq_2;
DROP TABLE company_seq;
