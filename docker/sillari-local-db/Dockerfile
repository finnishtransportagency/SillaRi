FROM postgis/postgis:13-3.0
RUN localedef -i fi_FI -c -f UTF-8 -A /usr/share/locale/locale.alias fi_FI.UTF8
ENV LANG fi_FI.utf8
COPY init_db.sql /docker-entrypoint-initdb.d/
