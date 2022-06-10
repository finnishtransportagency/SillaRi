package fi.vaylavirasto.sillari.model;

import lombok.*;

@Data
@EqualsAndHashCode(callSuper = false)
@ToString(callSuper = true)
public class PicInfoModel {
    private long id;
    private boolean mainPic;
    private String taken;
}
