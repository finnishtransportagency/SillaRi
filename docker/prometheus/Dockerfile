FROM 384409174079.dkr.ecr.eu-west-1.amazonaws.com/prometheus
MAINTAINER Jari Piitulainen <jari.piitulainen@cgi.com>
USER root
ADD prometheus.yml /etc/prometheus/
ADD prometheus-test.yml /etc/prometheus/
ADD prometheus-prod.yml /etc/prometheus/
ADD prometheus-preprod.yml /etc/prometheus/
ADD startprometheus.sh /startprometheus.sh
RUN chmod gou+rx /startprometheus.sh

# healthcheck
RUN mkdir /check
RUN chmod gou+rwx /check/
COPY ./healthcheck.sh /check
RUN chmod gou+rx /check/healthcheck.sh
#RUN apt-get install dos2unix
#RUN dos2unix /check/healthcheck.sh
EXPOSE 9090
#RUN mv /prometheus /prometheus_old
ENTRYPOINT ["/startprometheus.sh"]