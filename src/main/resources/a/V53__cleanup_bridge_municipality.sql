--Select only municipality name from 'tunnus:number,nimi:text' currently in municipality column
UPDATE sillari.bridge b1 SET municipality = (SELECT split_part(municipality, ':', 3) from sillari.bridge b2 where b1.id = b2.id);
