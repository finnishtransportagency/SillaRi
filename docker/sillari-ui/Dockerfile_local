FROM openjdk:11
MAINTAINER Jari Piitulainen <jari.piitulainen@cgi.com>
VOLUME /tmp
ADD app/sillari-ui.jar sillari-ui.jar
RUN bash -c 'touch /sillari-ui.jar'
ADD startapp.sh /startapp.sh
RUN chmod gou+rx /startapp.sh
EXPOSE 9013
ENTRYPOINT ["/startapp.sh"]
