import moment from "moment";
import IPermit from "../interfaces/IPermit";
import IRouteTransport from "../interfaces/IRouteTransport";
import { TransportStatus } from "./constants";

export const isPermitValid = (permit: IPermit): boolean => {
  if (permit) {
    const { validEndDate } = permit;
    const end = moment(validEndDate);
    const now = moment();
    return !!validEndDate && end.isAfter(now);
  } else {
    return false;
  }
};

export const isTransportEditable = (transport: IRouteTransport, permit: IPermit): boolean => {
  if (transport) {
    const { currentStatus } = transport;
    const { status } = currentStatus || {};
    return isPermitValid(permit) && status === TransportStatus.PLANNED;
  } else {
    return false;
  }
};

export const isTimestampCurrentOrAfter = (dateTime: Date): boolean => {
  const now = moment(new Date());
  return moment(dateTime).isAfter(now, "minutes") || moment(dateTime).isSame(now, "minute");
};

export const isPlannedDateBefore = (selectedTime: Date | undefined, previousTime: Date | undefined, departureTime: Date | undefined): boolean => {
  if (selectedTime && previousTime && moment(selectedTime).isBefore(moment(previousTime), "dates")) {
    return true;
  }
  return !!(selectedTime && departureTime && moment(selectedTime).isBefore(moment(departureTime), "dates"));
};

export const isPlannedTimeBefore = (selectedTime: Date | undefined, previousTime: Date | undefined, departureTime: Date | undefined): boolean => {
  if (!selectedTime) {
    return false;
  }
  const selectedMoment = moment(selectedTime);
  const departureMoment = departureTime ? moment(departureTime) : null;
  const previousMoment = previousTime ? moment(previousTime) : null;

  // Validate times only when date is the same - date errors shown in date box
  const departureDateIsSame = departureMoment && selectedMoment.isSame(departureMoment, "dates");
  const previousDateIsSame = previousMoment && selectedMoment.isSame(previousMoment, "dates");

  if (previousDateIsSame && selectedMoment.isBefore(previousMoment, "minutes")) {
    return true;
  }

  // If selected time is after previous, or it's the first one, compare to departureTime.
  // However, if departure date is different from previous date, errors are shown in date box - no need to show it in time box.
  return !!(departureDateIsSame && previousDateIsSame && selectedMoment.isBefore(departureMoment, "minutes"));
};
