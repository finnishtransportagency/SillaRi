insert into sillari.supervision (route_bridge_id, route_transport_id, planned_time, conforms_to_permit)
select rb.id, rt.id, '2021-09-22 06:06:06 +03:00', true -- TODO change to false
from sillari.route_bridge rb left join sillari.supervision s on rb.id = s.route_bridge_id
                             inner join sillari.route r on rb.route_id = r.id
                             inner join sillari.route_transport rt on r.id = rt.route_id
where s.id is null;

insert into sillari.supervision_status (supervision_id, status, time)
select s.id,
       'PLANNED',
       ('2021-09-0' || (floor(random() * (9 - 1 + 1) + 1)::int) || ' 0' || (floor(random() * (9 - 1 + 1) + 1)::int) ||
        ':0' || (floor(random() * (9 - 1 + 1) + 1)::int) || ':00 +03:00')::timestamptz
from sillari.supervision s left join sillari.supervision_status ss on s.id = ss.supervision_id
where ss.id is null;

alter table sillari.supervision alter column route_transport_id drop not null;
