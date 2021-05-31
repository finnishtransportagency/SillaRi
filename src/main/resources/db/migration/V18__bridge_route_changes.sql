ALTER TABLE sillari.bridge ADD COLUMN IF NOT EXISTS oid text;
ALTER TABLE sillari.bridge ADD COLUMN IF NOT EXISTS status text;
ALTER TABLE sillari.bridge ADD COLUMN IF NOT EXISTS geom geometry(POINT, 3067);

ALTER TABLE sillari.route ADD COLUMN IF NOT EXISTS geom geometry(LINESTRING, 3067);
