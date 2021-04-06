alter table sillari.bridge add column shortName text;

update sillari.bridge set shortName = 'O-'||id;

