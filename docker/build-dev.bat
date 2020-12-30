echo "build geoserver"
cd geoserver
docker build -t geoserver .
docker tag geoserver 384409174079.dkr.ecr.eu-west-1.amazonaws.com/sillari-geoserver:latest 384409174079.dkr.ecr.eu-west-1.amazonaws.com/sillari-geoserver:v002
docker push 384409174079.dkr.ecr.eu-west-1.amazonaws.com/sillari-geoserver
cd ..
