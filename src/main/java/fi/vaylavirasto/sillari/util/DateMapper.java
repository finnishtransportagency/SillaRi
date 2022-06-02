package fi.vaylavirasto.sillari.util;

import java.time.LocalDateTime;
import java.time.OffsetDateTime;
import java.time.ZoneId;
import java.time.ZoneOffset;
import java.time.format.DateTimeFormatter;

public class DateMapper {

    public static OffsetDateTime localDateToOffsetDate(LocalDateTime localDateTime) {
        if (localDateTime == null) {
            return null;
        }
        final ZoneId zone = ZoneId.of("Europe/Helsinki");
        ZoneOffset zoneOffSet = zone.getRules().getOffset(localDateTime);
        return localDateTime.atOffset(zoneOffSet);
    }

    public static LocalDateTime offsetDateToLocalDate(OffsetDateTime offsetDateTime) {
        if (offsetDateTime == null) {
            return null;
        }
        return offsetDateTime.toLocalDateTime();
    }

    public static LocalDateTime stringToLocalDate(String dateTime) {
        if (dateTime == null) {
            return null;
        }
        DateTimeFormatter formatter = DateTimeFormatter.ofPattern("dd.MM.yyyy HH:mm:ss");
        return LocalDateTime.parse(dateTime, formatter);
    }

    public static OffsetDateTime stringToOffsetDate(String dateTime) {
        if (dateTime == null) {
            return null;
        }
        LocalDateTime localDateTime = stringToLocalDate(dateTime);
        return localDateToOffsetDate(localDateTime);
    }

}
