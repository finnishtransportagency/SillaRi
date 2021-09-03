create sequence if not exists sillari.supervision_report_id_seq;

create table sillari.supervision_report
(
    id                     integer not null DEFAULT nextval('supervision_report_id_seq'),
    supervision_id         integer not null,
    driving_line_ok        boolean, --ajolinjaa on noudatettu
    driving_line_info      text,    --miksi ajolinjaa ei hyväksytä
    speed_limit_ok         boolean, --ajonopeus on hyväksytty
    speed_limit_info       text,    --miksi ajonopeutta ei hyväksytä
    anomalies              boolean, --poikkeavia havaintoja
    anomalies_description  text,    --kuvaile poikkeavia havaintoja
    surface_damage         boolean, --päällystevaurio
    seam_damage            boolean, --liikuntasauman rikkoutuminen
    bendings_displacements boolean, --pysyvä taipuma tai muu siirtymä
    other_observations     text,    --jotain muuta, mitä
    additional_info        text,    --lisätiedot
    PRIMARY KEY (id),
    CONSTRAINT supervision_report_supervision_id_fkey FOREIGN KEY (supervision_id) REFERENCES sillari.supervision (id) DEFERRABLE
);
