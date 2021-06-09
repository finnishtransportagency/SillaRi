FROM 384409174079.dkr.ecr.eu-west-1.amazonaws.com/sillari-java:latest
MAINTAINER Jari Piitulainen <jari.piitulainen@cgi.com>
VOLUME /tmp
ADD app/sillari-ui.jar sillari-ui.jar
RUN bash -c 'touch /sillari-ui.jar'
ADD startapp.sh /startapp.sh
RUN chmod gou+rx /startapp.sh
EXPOSE 9013
ENTRYPOINT ["/startapp.sh"]
