package fi.vaylavirasto.sillari.model;

import lombok.Data;

import java.time.OffsetDateTime;

@Data
public class SupervisionStatusModel {
    private Integer id;
    private Integer supervisionId;
    private SupervisionStatusType status;
    private OffsetDateTime time;
}
