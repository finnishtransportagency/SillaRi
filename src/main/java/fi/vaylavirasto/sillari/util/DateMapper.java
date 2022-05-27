package fi.vaylavirasto.sillari.util;

import java.time.LocalDateTime;
import java.time.OffsetDateTime;
import java.time.ZoneId;
import java.time.ZoneOffset;
import java.time.format.DateTimeFormatter;

public class DateMapper {

    public OffsetDateTime localDateToOffsetDate(LocalDateTime localDateTime) {
        final ZoneId zone = ZoneId.of("Europe/Helsinki");
        ZoneOffset zoneOffSet = zone.getRules().getOffset(localDateTime);
        return localDateTime.atOffset(zoneOffSet);
    }

    public LocalDateTime offsetDateToLocalDate(OffsetDateTime offsetDateTime) {
        return offsetDateTime.toLocalDateTime();
    }

    public LocalDateTime stringToLocalDate(String dateTime) {
        DateTimeFormatter formatter = DateTimeFormatter.ofPattern("dd.MM.yyyy HH:mm:ss");
        return LocalDateTime.parse(dateTime, formatter);
    }

    public OffsetDateTime stringToOffsetDate(String dateTime) {
        LocalDateTime localDateTime = stringToLocalDate(dateTime);
        return localDateToOffsetDate(localDateTime);
    }

}
