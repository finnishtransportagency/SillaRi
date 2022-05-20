/*TODO remove alter tables after code is updated to use supervision_report_pdf*/
alter table sillari.supervision_report add column if not exists pdf_ktv_object_id text;
alter table sillari.supervision_image add column if not exists ktv_object_id text;

create sequence IF NOT EXISTS sillari.supervision_report_pdf_id_seq;

create table IF NOT EXISTS sillari.supervision_report_pdf(
    id integer NOT NULL DEFAULT nextval('supervision_report_pdf_id_seq'),
    supervision_report_id integer not null,
    filename text,
    object_key text,
    ktv_object_id text,
    status text,
    status_time timestamp with time zone,
    row_created_time timestamp with time zone default now(),
    row_updated_time timestamp with time zone,
    primary key(id),
    CONSTRAINT supervision_report_pdf_supervision_report_id_fkey FOREIGN KEY (supervision_report_id) REFERENCES sillari.supervision_report (id) DEFERRABLE
);

CREATE TRIGGER supervision_report_pdf_row_updated
    BEFORE UPDATE ON sillari.supervision_report_pdf
    FOR EACH ROW
EXECUTE PROCEDURE update_row_updated_time();
