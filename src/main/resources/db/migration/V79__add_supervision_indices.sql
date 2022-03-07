ALTER TABLE supervision_supervisor ALTER username SET NOT NULL;
CREATE INDEX supervision_supervisor_username ON supervision_supervisor(username);
ALTER TABLE supervision_status ALTER status SET NOT NULL;
ALTER TABLE supervision_status ALTER time SET NOT NULL;
CREATE INDEX supervision_status_status ON supervision_status(status);
