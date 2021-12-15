update sillari.route_transport rt set tractor_unit = 'ABC-963' where rt.route_id = (select r.id from sillari.route r where r.permit_id = (
    select p.id from permit p where permit_number = 'MV/176/2021'
    ));

update sillari.route_transport rt set tractor_unit = 'DEF-852' where rt.route_id = (select r.id from sillari.route r where r.permit_id = (
    select p.id from permit p where permit_number = 'MV/177/2021'
));

update sillari.route_transport rt set tractor_unit = 'GHI-741' where rt.route_id = (select r.id from sillari.route r where r.permit_id = (
    select p.id from permit p where permit_number = '149/2021'
));

update sillari.route_transport rt set tractor_unit = 'MNO-529' where rt.route_id = (select r.id from sillari.route r where r.permit_id = (
    select p.id from permit p where permit_number = '150/2021'
));
