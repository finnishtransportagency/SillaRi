FROM java:8
MAINTAINER Jari Piitulainen <jari.piitulainen@cgi.com>
ADD app/sillari.jar sillari.jar
ADD startapp.sh /startapp.sh
RUN chmod gou+rx /startapp.sh
RUN bash -c 'touch /sillari.war'
RUN echo "networkaddress.cache.ttl=60" >> /usr/lib/jvm/java-8-openjdk-amd64/jre/lib/security/java.security
RUN cp /usr/share/zoneinfo/Europe/Helsinki /etc/localtime
ENTRYPOINT ["/startapp.sh"]
