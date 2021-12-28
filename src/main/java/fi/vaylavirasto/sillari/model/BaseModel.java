package fi.vaylavirasto.sillari.model;

import lombok.Getter;
import lombok.Setter;

import java.time.OffsetDateTime;

@Getter
@Setter
public class BaseModel {
    private OffsetDateTime rowCreatedTime;
    private OffsetDateTime rowUpdatedTime;
}
