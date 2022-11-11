create or replace view sillari.route_transport_number_view as
select rtn.id                 as id,
       r.id                   as route_id,
       r.lelu_id              as route_lelu_id,
       r.transport_count      as route_total_transport_count,
       p.id                   as permit_id,
       p.permit_number        as permit_number,
       p.lelu_version         as permit_lelu_version,
       p.is_current_version   as permit_is_current_version,
       rtn.route_transport_id as route_transport_id,
       rtn.transport_number   as transport_number,
       rtn.used               as used,
       rtn.row_created_time   as row_created_time,
       rtn.row_updated_time   as row_updated_time
from sillari.route_transport_number rtn
         inner join sillari.route r on rtn.route_id = r.id
         inner join sillari.permit p on r.permit_id = p.id;


ALTER TABLE sillari.route ADD CONSTRAINT unique_permit_route_lelu_id UNIQUE(permit_id, lelu_id);
