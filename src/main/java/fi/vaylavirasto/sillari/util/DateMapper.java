package fi.vaylavirasto.sillari.util;

import java.time.LocalDateTime;
import java.time.OffsetDateTime;
import java.time.ZoneId;
import java.time.ZoneOffset;

public class DateMapper {

    public OffsetDateTime localDateToOffsetDate(LocalDateTime localDateTime) {
        final ZoneId zone = ZoneId.of("Europe/Helsinki");
        ZoneOffset zoneOffSet = zone.getRules().getOffset(localDateTime);
        return localDateTime.atOffset(zoneOffSet);
    }

    public LocalDateTime offsetDateToLocalDate(OffsetDateTime offsetDateTime) {
        return offsetDateTime.toLocalDateTime();
    }

}
