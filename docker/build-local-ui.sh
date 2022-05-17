#!/bin/bash
pushd ../ui
mvn -DskipTests=true clean install
popd
mkdir -p ./sillari-ui/app
cp ../ui/target/sillari-*.jar ./sillari-ui/app/sillari-ui.jar
docker-compose -f docker-compose-local.yml build sillari-ui
rm ./sillari-ui/app/sillari-ui.jar
