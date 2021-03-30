#!/bin/bash
pushd ../
mvn -DskipTests=true clean install
popd
mkdir -p ./sillari-backend/app
cp ../target/sillari-*.jar ./sillari-backend/app/sillari.jar
docker-compose -f docker-compose-local.yml build sillari-backend
rm ./sillari-backend/app/sillari.jar
