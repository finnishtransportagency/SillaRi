insert into sillari.supervision (route_bridge_id, route_transport_id, planned_time, conforms_to_permit)
select rb.id, rt.id, '2021-09-22 06:06:06 +03:00', false
from sillari.route_bridge rb
         inner join sillari.route r on rb.route_id = r.id
         inner join sillari.route_transport rt on r.id = rt.route_id;

--Random (between 1-9) date and time in August 2021
insert into sillari.supervision_status (supervision_id, status, time)
select s.id,
       'PLANNED',
       ('2021-08-0' || (floor(random() * (9 - 1 + 1) + 1)::int) || ' 0' || (floor(random() * (9 - 1 + 1) + 1)::int) ||
        ':0' || (floor(random() * (9 - 1 + 1) + 1)::int) || ':00 +03:00')::timestamptz
from sillari.supervision s;