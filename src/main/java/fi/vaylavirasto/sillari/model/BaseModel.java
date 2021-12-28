package fi.vaylavirasto.sillari.model;

import lombok.Getter;

import java.time.OffsetDateTime;

@Getter
public class BaseModel {
    private OffsetDateTime rowCreatedTime;
    private OffsetDateTime rowUpdatedTime;
}
