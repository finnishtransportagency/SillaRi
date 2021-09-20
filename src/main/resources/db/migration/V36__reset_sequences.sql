--Reset all sequences, false ensures nextval is 1 instead of 2

--Address
SELECT setval('sillari.address_id_seq', 1, false);

--Axle
SELECT setval('sillari.axle_id_seq', 1, false);

--Axle chart
SELECT setval('sillari.axle_chart_id_seq', 1, false);

--Bridge
SELECT setval('sillari.bridge_id_seq', 1, false);

--Bridge image
SELECT setval('sillari.bridge_image_id_seq', 1, false);

--Company
SELECT setval('sillari.company_id_seq', 1, false);

--Permit
ALTER SEQUENCE IF EXISTS sillari.authorization_id_seq RENAME TO permit_id_seq;
SELECT setval('sillari.permit_id_seq', 1, false);

--Route
SELECT setval('sillari.route_id_seq', 1, false);

--Route_bridge
ALTER SEQUENCE IF EXISTS sillari.routesbridges_id_seq RENAME TO route_bridge_id_seq;
SELECT setval('sillari.route_bridge_id_seq', 1, false);

--Route_transport
SELECT setval('sillari.route_transport_id_seq', 1, false);

--Route_transport_driver
SELECT setval('sillari.route_transport_driver_id_seq', 1, false);

--Route_transport_status
SELECT setval('sillari.route_transport_status_id_seq', 1, false);

--Supervision
SELECT setval('sillari.supervision_id_seq', 1, false);

--Supervision_image
SELECT setval('sillari.supervision_image_id_seq', 1, false);

--Supervision_report
SELECT setval('sillari.supervision_report_id_seq', 1, false);

--Supervision_status
SELECT setval('sillari.supervision_status_id_seq', 1, false);

--Supervisor
SELECT setval('sillari.supervisor_id_seq', 1, false);

--Transport dimensions
SELECT setval('sillari.transport_dimensions_id_seq', 1, false);

--Unloaded transport dimensions
SELECT setval('sillari.unloaded_transport_dimensions_id_seq', 1, false);

--Vehicle
SELECT setval('sillari.vehicle_id_seq', 1, false);
