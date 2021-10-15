update sillari.route_transport
set planned_departure_time = ('2021-10-1' || (floor(random() * (9 - 1 + 1) + 1)::int) || ' 0' ||
                              (floor(random() * (9 - 1 + 1) + 1)::int) ||
                              ':0' || (floor(random() * (9 - 1 + 1) + 1)::int) || ':00 +03:00')::timestamptz;

insert into sillari.route_transport_status (route_transport_id, status, time)
select rt.id,
       'PLANNED',
       rt.planned_departure_time
from sillari.route_transport rt
         left join sillari.route_transport_status rts on rt.id = rts.route_transport_id
where rts.id is null;

insert into sillari.route_transport_status (route_transport_id, status, time)
select rt.id,
       'DEPARTED',
       (rt.planned_departure_time + interval '1' hour)
from sillari.route_transport rt
limit 2;
