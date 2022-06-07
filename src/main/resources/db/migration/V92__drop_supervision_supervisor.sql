drop table if exists sillari.supervision_supervisor;
drop sequence if exists supervision_supervisor_id_seq;

/* Cleanup other unused sequences */
drop sequence if exists supervisor_id_seq;
drop sequence if exists transport_id_seq;
drop sequence if exists transport_registration_id_seq;
