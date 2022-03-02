package fi.vaylavirasto.sillari.model;

import lombok.Getter;
import lombok.Setter;
import lombok.ToString;

import java.time.OffsetDateTime;

@Getter
@Setter
@ToString
public class BaseModel {
    private OffsetDateTime rowCreatedTime;
    private OffsetDateTime rowUpdatedTime;
}
