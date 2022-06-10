package fi.vaylavirasto.sillari.model;

import lombok.*;

import java.time.OffsetDateTime;

@Data
@EqualsAndHashCode(callSuper = false)
@ToString(callSuper = true)
public class PicInfoModel {
    private long id;
    private boolean mainPic;
    private OffsetDateTime taken;
}
