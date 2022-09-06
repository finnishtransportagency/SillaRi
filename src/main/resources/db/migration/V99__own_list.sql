CREATE SEQUENCE IF NOT EXISTS sillari.own_list_id_seq;
CREATE TABLE IF NOT EXISTS sillari.own_list
(
    id                   integer not null DEFAULT nextval('sillari.own_list_id_seq'),
    contract_business_id text,
    supervision_id       integer not null,
    PRIMARY KEY (id),
    CONSTRAINT own_list_supervision_id_fkey FOREIGN KEY (supervision_id) REFERENCES supervision (id) DEFERRABLE
);
create index if not exists own_list_supervision_id on sillari.own_list (supervision_id);
create index if not exists own_list_contract_business_id on sillari.own_list (contract_business_id);