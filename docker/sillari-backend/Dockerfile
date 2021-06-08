FROM 384409174079.dkr.ecr.eu-west-1.amazonaws.com/sillari-java:latest
MAINTAINER Jari Piitulainen <jari.piitulainen@cgi.com>
ADD app/sillari.jar sillari.jar
ADD startapp.sh /startapp.sh
RUN chmod gou+rx /startapp.sh
RUN bash -c 'touch /sillari.war'
RUN echo "networkaddress.cache.ttl=60" >> /usr/local/openjdk-11/conf/security/java.security
RUN cp /usr/share/zoneinfo/Europe/Helsinki /etc/localtime
ENTRYPOINT ["/startapp.sh"]
