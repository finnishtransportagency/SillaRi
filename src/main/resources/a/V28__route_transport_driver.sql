CREATE TABLE sillari.route_transport_driver (
    id INTEGER PRIMARY KEY GENERATED ALWAYS AS IDENTITY NOT NULL,
    route_transport_id INTEGER NOT NULL,
    driver_id_hash TEXT NOT NULL,
    CONSTRAINT route_transport_driver_route_transport_id_fkey
        FOREIGN KEY (route_transport_id)
            REFERENCES sillari.route_transport(id)
);
