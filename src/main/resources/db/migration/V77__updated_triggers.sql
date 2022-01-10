CREATE OR REPLACE FUNCTION update_row_updated_time() RETURNS TRIGGER
    LANGUAGE plpgsql
AS $$
BEGIN
    NEW.row_updated_time = now();
    RETURN NEW;
END;
$$;

CREATE TRIGGER address_row_updated
    BEFORE UPDATE ON sillari.address
    FOR EACH ROW
EXECUTE PROCEDURE update_row_updated_time();

CREATE TRIGGER axle_row_updated
    BEFORE UPDATE ON sillari.axle
    FOR EACH ROW
EXECUTE PROCEDURE update_row_updated_time();

CREATE TRIGGER axle_chart_row_updated
    BEFORE UPDATE ON sillari.axle_chart
    FOR EACH ROW
EXECUTE PROCEDURE update_row_updated_time();

CREATE TRIGGER bridge_row_updated
    BEFORE UPDATE ON sillari.bridge
    FOR EACH ROW
EXECUTE PROCEDURE update_row_updated_time();

CREATE TRIGGER bridge_image_row_updated
    BEFORE UPDATE ON sillari.bridge_image
    FOR EACH ROW
EXECUTE PROCEDURE update_row_updated_time();

CREATE TRIGGER company_row_updated
    BEFORE UPDATE ON sillari.company
    FOR EACH ROW
EXECUTE PROCEDURE update_row_updated_time();

CREATE TRIGGER permit_row_updated
    BEFORE UPDATE ON sillari.permit
    FOR EACH ROW
EXECUTE PROCEDURE update_row_updated_time();

CREATE TRIGGER route_row_updated
    BEFORE UPDATE ON sillari.route
    FOR EACH ROW
EXECUTE PROCEDURE update_row_updated_time();

CREATE TRIGGER route_bridge_row_updated
    BEFORE UPDATE ON sillari.route_bridge
    FOR EACH ROW
EXECUTE PROCEDURE update_row_updated_time();

CREATE TRIGGER route_transport_row_updated
    BEFORE UPDATE ON sillari.route_transport
    FOR EACH ROW
EXECUTE PROCEDURE update_row_updated_time();

CREATE TRIGGER route_transport_password_row_updated
    BEFORE UPDATE ON sillari.route_transport_password
    FOR EACH ROW
EXECUTE PROCEDURE update_row_updated_time();

CREATE TRIGGER route_transport_status_row_updated
    BEFORE UPDATE ON sillari.route_transport_status
    FOR EACH ROW
EXECUTE PROCEDURE update_row_updated_time();

CREATE TRIGGER supervision_row_updated
    BEFORE UPDATE ON sillari.supervision
    FOR EACH ROW
EXECUTE PROCEDURE update_row_updated_time();

CREATE TRIGGER supervision_image_row_updated
    BEFORE UPDATE ON sillari.supervision_image
    FOR EACH ROW
EXECUTE PROCEDURE update_row_updated_time();

CREATE TRIGGER supervision_report_row_updated
    BEFORE UPDATE ON sillari.supervision_report
    FOR EACH ROW
EXECUTE PROCEDURE update_row_updated_time();

CREATE TRIGGER supervision_status_row_updated
    BEFORE UPDATE ON sillari.supervision_status
    FOR EACH ROW
EXECUTE PROCEDURE update_row_updated_time();

CREATE TRIGGER supervision_supervisor_row_updated
    BEFORE UPDATE ON sillari.supervision_supervisor
    FOR EACH ROW
EXECUTE PROCEDURE update_row_updated_time();

CREATE TRIGGER supervisor_row_updated
    BEFORE UPDATE ON sillari.supervisor
    FOR EACH ROW
EXECUTE PROCEDURE update_row_updated_time();

CREATE TRIGGER transport_dimensions_row_updated
    BEFORE UPDATE ON sillari.transport_dimensions
    FOR EACH ROW
EXECUTE PROCEDURE update_row_updated_time();

CREATE TRIGGER unloaded_transport_dimensions_row_updated
    BEFORE UPDATE ON sillari.unloaded_transport_dimensions
    FOR EACH ROW
EXECUTE PROCEDURE update_row_updated_time();

CREATE TRIGGER vehicle_row_updated
    BEFORE UPDATE ON sillari.vehicle
    FOR EACH ROW
EXECUTE PROCEDURE update_row_updated_time();
