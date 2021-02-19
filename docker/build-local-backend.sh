pushd ../
mvn -DskipTests=true clean install
popd
cp ../target/sillari-*.jar ./sillari-backend/app/sillari.jar
docker-compose -f docker-compose-local.yml build sillari-backend
rm ./sillari-backend/app/sillari.jar
