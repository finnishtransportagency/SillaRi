#!/bin/bash

# this script should be located in /home/klp
# arg 1 = route shapefile zip filename - the file must in the same directory as this script
# arg 2 = calculation id - the id must already exist in the database

connection_string="host=sillari-local-db  port=5432 dbname=sillari user=sillari password=sillari1234"

error_handler() {
  echo "error"
  exit 255
}
trap error_handler ERR

# import the shapefile in the zip to a temporary table 'route_import'
echo ogr2ogr --config PG_USE_COPY YES -f PGDump /vsistdout/ /vsizip/$1 -lco SCHEMA=sillari -lco GEOMETRY_NAME=geom$2 | psql "$connection_string" -f -
ogr2ogr --config PG_USE_COPY YES -f PGDump /vsistdout/ /vsizip/$1 -lco SCHEMA=sillari -lco GEOMETRY_NAME="geom$2" | psql "$connection_string" -f -

echo "hello"

# copy the route geometry to the 'calculation' table, using ST_Collect to combine all LineStrings into a single MultiLineString
psql "$connection_string" -c "update route set geom = (select geom$2 as geom from feature) where id = $2;"

# drop the temporary table
psql "$connection_string" -c "drop table feature;"

# delete the file
rm ./$1

echo "done"
exit 0
