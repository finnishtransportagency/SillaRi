update sillari.address set street= 'Hämeenpuisto 1, 33210 TAMPERE' WHERE id=1;
update sillari.address set street= 'Kallontie 14, 28880 PORI' WHERE id=2	;
update sillari.address set street= 'Lentäjänpolku 2, 70910 KUOPIO' WHERE id=3	;
update sillari.address set street= 'Hangontie 1, 23500 UUSIKAUPUNKI' WHERE id=4	;
update sillari.address set street= 'Vanhankirkontie 2, 42700 KEURUU' WHERE id=5	;
update sillari.address set street= 'Ihalantie 1, 42600 MULTIA' WHERE id=6;
update sillari.address set street= 'Hämeenpuisto 1, 33210 TAMPERE' WHERE id=7;
update sillari.address set street= 'Kallontie 14, 28880 PORI' WHERE id=8;

ALTER TABLE sillari.address RENAME COLUMN street TO streetaddress;