echo password | sudo -i -S
docker system prune -a -f
./build-local-db.sh
./run-local-db.sh> /dev/null 2>&1 &
./build-local-backend.sh
./run-local-backend.sh