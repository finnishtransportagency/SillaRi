DELETE FROM sillari.supervision_report;
DELETE FROM sillari.supervision_status;

INSERT INTO sillari.supervision_status (supervision_id, status, time) (
    SELECT s.id, 'PLANNED', s.planned_time from sillari.supervision s
);

ALTER TABLE sillari.supervision_report ADD UNIQUE (supervision_id);
