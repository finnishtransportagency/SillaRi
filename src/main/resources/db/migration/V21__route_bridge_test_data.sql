-- delete the route bridges from the first test route
DELETE FROM supervision_status WHERE supervision_id = (SELECT id FROM supervision WHERE route_bridge_id IN (SELECT id FROM route_bridge WHERE route_id = 1));
DELETE FROM supervision WHERE route_bridge_id IN (SELECT id FROM route_bridge WHERE route_id = 1);
DELETE FROM route_bridge WHERE route_id = 1;

-- insert semi-realistic test route bridges for the first route by selecting bridges contained in a buffer around the route line
-- NOTE: this may take a minute or so to run
INSERT INTO route_bridge (route_id, bridge_id)
SELECT 1, b.id FROM bridge b, (SELECT ST_Buffer(r.geom, 10) geom FROM route r WHERE r.id = 1) a WHERE b.geom IS NOT NULL AND b.name LIKE '%silta%' AND b.status = 'kaytossa' AND ST_Contains(a.geom, b.geom) = TRUE;
