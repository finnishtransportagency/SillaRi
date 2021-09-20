-- insert semi-realistic test route bridges for the first route by selecting bridges contained in a buffer around the route line
-- NOTE: this may take a minute or so to run
INSERT INTO route_bridge (route_id, bridge_id)
SELECT 1, b.id FROM bridge b, (SELECT ST_Buffer(r.geom, 10) geom FROM route r WHERE r.id = 1) a WHERE b.geom IS NOT NULL AND b.name LIKE '%silta%' AND b.status = 'kaytossa' AND ST_Contains(a.geom, b.geom) = TRUE;

INSERT INTO route_bridge (route_id, bridge_id)
SELECT 2, b.id FROM bridge b, (SELECT ST_Buffer(r.geom, 10) geom FROM route r WHERE r.id = 2) a WHERE b.geom IS NOT NULL AND b.name LIKE '%silta%' AND b.status = 'kaytossa' AND ST_Contains(a.geom, b.geom) = TRUE;

INSERT INTO route_bridge (route_id, bridge_id)
SELECT 3, b.id FROM bridge b, (SELECT ST_Buffer(r.geom, 10) geom FROM route r WHERE r.id = 3) a WHERE b.geom IS NOT NULL AND b.name LIKE '%silta%' AND b.status = 'kaytossa' AND ST_Contains(a.geom, b.geom) = TRUE;

INSERT INTO route_bridge (route_id, bridge_id)
SELECT 4, b.id FROM bridge b, (SELECT ST_Buffer(r.geom, 10) geom FROM route r WHERE r.id = 4) a WHERE b.geom IS NOT NULL AND b.name LIKE '%silta%' AND b.status = 'kaytossa' AND ST_Contains(a.geom, b.geom) = TRUE;

INSERT INTO route_bridge (route_id, bridge_id)
SELECT 5, b.id FROM bridge b, (SELECT ST_Buffer(r.geom, 10) geom FROM route r WHERE r.id = 5) a WHERE b.geom IS NOT NULL AND b.name LIKE '%silta%' AND b.status = 'kaytossa' AND ST_Contains(a.geom, b.geom) = TRUE;
