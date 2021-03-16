create sequence company_id_seq;
create sequence bridge_id_seq;
create sequence transportsbridge_id_seq;
create sequence authorization_id_seq;
create sequence route_id_seq;
create sequence crossing_id_seq;

create table sillari.route
(
    id   integer NOT NULL DEFAULT nextval('route_id_seq'),
    authorization_id integer not null,
    name text,
    departure_address_id integer,
    arrival_address_id integer,
    departure_time text,
    arrival_time text,
    primary key (id)
);

create table sillari.authorization
(
    id   integer NOT NULL DEFAULT nextval('authorization_id_seq'),
    company_id integer not null,
    permissionId text not null,
    validStartDate text,
    validEndDate text,
    primary key (id)
);

create table sillari.company
(
    id   integer NOT NULL DEFAULT nextval('company_id_seq'),
    name text,
    primary key (id)
);

create table bridge
(
    id    integer not NULL DEFAULT nextval('bridge_id_seq'),
    name text,
    primary key (id)
);

create table sillari.crossing
(
    id integer not null default nextval('crossing_id_seq'),
    route_id integer,
    bridge_id integer,
    name text,
    primary key(id)
);

create table transportsbridge(
    id integer not null DEFAULT nextval('transportsbridge_id_seq'),
    transprort_id integer not null,
    bridgeid integer not null,
    primary key(id)
);

alter table sillari.transport add column company_id integer;
alter table sillari.transport add column begindate timestamp;
alter table sillari.transport add column enddate timestamp;

update sillari.transport set begindate = now();
update sillari.transport set enddate = now();
insert into company(id,name) (select id,'company' || id from sillari.transport);
update sillari.transport set company_id = transport.id;

insert into sillari.bridge (id,name) (select id, 'bridge'||id from sillari.transport);
insert into sillari.transportsbridge (transprort_id,bridgeid) (select id, id from sillari.transport);

insert into sillari.authorization(id, company_id, permissionId, validStartDate, validEndDate)
 (select id, id, 'lupa-'||id, now(),now() from sillari.company );

insert into sillari.route(id, authorization_id, name, departure_address_id, arrival_address_id, departure_time, arrival_time)
 (select id,id,'route-'||id, departure_address_id,arrival_address_id, now(),now() from sillari.transport);


create index route_authorization_id on sillari.route(authorization_id);

create index authorization_company_id on sillari.authorization(company_id);

insert into sillari.crossing(id, route_id, bridge_id, name)
    (select id, id, id, 'crossing-'||id from sillari.company );

