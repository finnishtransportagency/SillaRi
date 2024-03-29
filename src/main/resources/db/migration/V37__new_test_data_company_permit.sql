-- COMPANY
INSERT INTO sillari.company (id, "name", business_id) OVERRIDING SYSTEM VALUE VALUES (1, 'CGI Suomi Oy', '0357502-9');
INSERT INTO sillari.company (id, "name", business_id) OVERRIDING SYSTEM VALUE VALUES (2, 'Aitio Finland Oy', '2098655-9');
INSERT INTO sillari.company (id, "name", business_id) OVERRIDING SYSTEM VALUE VALUES (3, 'Euroopan kemikaalivirasto (ECHA)', '2139942-8');

-- Overriding system value doesn't update the sequence
SELECT setval('sillari.company_id_seq', 3);

--PERMIT
INSERT INTO sillari.permit (id, company_id, permit_number, transport_total_mass, lelu_version, additional_details, lelu_last_modified_date, valid_start_date, valid_end_date)
    OVERRIDING SYSTEM VALUE VALUES (1, 1, 'MV/176/2021', 25.5, 1, 'Reitin käytettävyys on varmistettava ennen kuljetusta. Käynnissä olevat silta- ja tietyöt sekä muut tilapäiset ja pysyvät rajoitusten muutokset on huomioitava.',
       '2021-07-06 15:31:49.000', '2021-06-28 09:00:00.000', '2022-03-28 00:00:00.000');

INSERT INTO sillari.permit (id, company_id, permit_number, transport_total_mass, lelu_version, additional_details, lelu_last_modified_date, valid_start_date, valid_end_date)
    OVERRIDING SYSTEM VALUE VALUES (2, 2, 'MV/177/2021', 62.0, 2, 'Reitin käytettävyys on varmistettava ennen kuljetusta. Käynnissä olevat silta- ja tietyöt sekä muut tilapäiset ja pysyvät rajoitusten muutokset on huomioitava.',
       '2021-07-08 12:27:50.000', '2021-06-29 00:00:00.000', '2021-12-29 00:00:00.000');

INSERT INTO sillari.permit (id, company_id, permit_number, transport_total_mass, lelu_version, additional_details, lelu_last_modified_date, valid_start_date, valid_end_date)
    OVERRIDING SYSTEM VALUE VALUES (3, 3, '149/2021', 74.0, 2, 'Reitin käytettävyys on varmistettava ennen kuljetusta. Käynnissä olevat silta- ja tietyöt sekä muut tilapäiset ja pysyvät rajoitusten muutokset on huomioitava.',
       '2021-07-08 12:27:50.000', '2021-06-29 00:00:00.000', '2021-12-29 00:00:00.000');

INSERT INTO sillari.permit (id, company_id, permit_number, transport_total_mass, lelu_version, additional_details, lelu_last_modified_date, valid_start_date, valid_end_date)
    OVERRIDING SYSTEM VALUE VALUES (4, 3, '150/2021', 142, 1, 'Huomioitava reitillä (koskee myös katuverkkoa ja yksityisteitä):kuljetuksen toteuttaja hoitaa kuljetuksen vaatimat liikennejärjestelyt, liikennemerkkien poistot ja uudelleen asennuksetkuljetuksen toteuttaja vastaa aiheuttamistaan vahingoista silloille ja muulle kuljetusreitille ggg afdasdsa Huomioitava reitillä (koskee myös katuverkkoa ja yksityisteitä):kuljetuksen toteuttaja hoitaa kuljetuksen vaatimat liikennejärjestelyt, liikennemerkkien poistot ja uudelleen asennuksetkuljetuksen toteuttaja vastaa aiheuttamistaan vahingoista silloille ja muulle kuljetusreitille',
       '2021-06-24 07:54:44.000', '2020-05-26 14:00:00.000', '2020-11-26 00:00:00.000');

-- Overriding system value doesn't update the sequence
SELECT setval('sillari.permit_id_seq', 4);
