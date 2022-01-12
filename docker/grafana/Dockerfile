FROM 384409174079.dkr.ecr.eu-west-1.amazonaws.com/grafana
MAINTAINER Jari Piitulainen <jari.piitulainen@cgi.com>
COPY ./grafana.ini /etc/grafana/grafana.ini
#RUN printf "deb http://archive.debian.org/debian/ jessie main\ndeb-src http://archive.debian.org/debian/ jessie main\ndeb http://security.debian.org jessie/updates main\ndeb-src http://security.debian.org jessie/updates main" > /etc/apt/sources.list
#RUN apt-get update
#RUN apt-get -y install wget
#RUN mkdir -p /data/grafana/plugins && chown -R grafana:grafana /data/grafana/plugins
#RUN grafana-cli --pluginsDir "/data/grafana/plugins" plugins install natel-plotly-panel && grafana-cli --pluginsDir "/data/grafana/plugins" plugins install jdbranham-diagram-panel
# healthcheck
#RUN mkdir /check
#RUN chmod gou+rwx /check/
#COPY healthcheck.sh /check
#RUN chmod gou+rx /check/healthcheck.sh
#RUN cp /usr/share/zoneinfo/Europe/Helsinki /etc/localtime
USER root
ADD startgrafana.sh /startgrafana.sh
RUN chmod gou+rx /startgrafana.sh
USER grafana
EXPOSE 3000 3000
ENTRYPOINT ["/startgrafana.sh"]