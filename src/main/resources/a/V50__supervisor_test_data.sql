INSERT INTO supervisor (firstname, lastname) SELECT 'Saara', 'Sillanvalvoja' WHERE NOT EXISTS (SELECT id FROM supervisor WHERE firstname = 'Saara' AND lastname = 'Sillanvalvoja');
INSERT INTO supervisor (firstname, lastname) SELECT 'Ville', 'Varavalvoja' WHERE NOT EXISTS (SELECT id FROM supervisor WHERE firstname = 'Ville' AND lastname = 'Varavalvoja');
