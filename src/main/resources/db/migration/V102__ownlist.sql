--Ownlist
create sequence if not exists sillari.ownlist_id_seq;

create table if not exists sillari.ownlist
(
    id        integer not null DEFAULT nextval('sillari.ownlist_id_seq'),
    username text,
    businessId text,
    listName  text,
    list        text,
    PRIMARY KEY (id)
);


