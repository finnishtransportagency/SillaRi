/* If contractor has been provided from LeLu, set supervisor to area contractor */
update sillari.supervision s set supervisor_type = 'AREA_CONTRACTOR', supervisor_company = rb.business_id from (
        select id, contract_business_id as business_id from sillari.route_bridge
    ) rb where rb.id = s.route_bridge_id and rb.business_id is not null;

/* Update the rest with transport company as the supervisor */
update sillari.supervision s set supervisor_type = 'OWN_SUPERVISOR', supervisor_company = (
    select c.business_id from sillari.company c
        inner join sillari.permit p on c.id = p.company_id
        inner join sillari.route r on p.id = r.permit_id
        inner join sillari.route_transport rt on r.id = rt.route_id
    where rt.id = s.route_transport_id
) where s.supervisor_company is null;
