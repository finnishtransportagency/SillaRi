CREATE TABLE sillari.route_transport_password (
    id INTEGER PRIMARY KEY GENERATED ALWAYS AS IDENTITY NOT NULL,
    route_transport_id INTEGER NOT NULL,
    transport_password TEXT UNIQUE NOT NULL,
    valid_from TIMESTAMP WITH TIME ZONE NOT NULL,
    valid_to TIMESTAMP WITH TIME ZONE NOT NULL,
    CONSTRAINT route_transport_password_route_transport_id_fkey
        FOREIGN KEY (route_transport_id)
            REFERENCES sillari.route_transport(id),
    CONSTRAINT route_transport_password_date_check
        CHECK (valid_to > valid_from)
);

DROP TABLE IF EXISTS route_transport_driver;
