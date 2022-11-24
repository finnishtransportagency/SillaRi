delete from sillari.crossing;
alter table sillari.crossing add column drivingLineInfo boolean;
alter table sillari.crossing add column speedInfo boolean;
alter table sillari.crossing add column exceptionsInfo boolean;
alter table sillari.crossing add column describe boolean;
alter table sillari.crossing add column drivingLineInfoDescription text;
alter table sillari.crossing add column speedInfoDescription text;
alter table sillari.crossing add column exceptionsInfoDescription text;
alter table sillari.crossing add column extraInfoDescription text;
alter table sillari.crossing add column started timestamp without time zone;
alter table sillari.crossing add column permanentBendings boolean;
alter table sillari.crossing add column twist boolean;
alter table sillari.crossing add column damage boolean;

create sequence route_bridge_id_seq;

create table sillari.routesbridges(
  id   integer NOT NULL DEFAULT nextval('route_bridge_id_seq'),
  routeid integer not NULL,
  bridgeid integer not null,
  primary key(id)
);
