docker-compose -f docker-compose-local.yml down
sudo rm -r ./sillari-local-db/pgdata
docker-compose -f docker-compose-local.yml build sillari-local-db
