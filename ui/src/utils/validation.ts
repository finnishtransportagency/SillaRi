import moment from "moment";
import IPermit from "../interfaces/IPermit";
import IRouteTransport from "../interfaces/IRouteTransport";
import { TransportStatus } from "./constants";
import { unitOfTime } from "moment/moment";

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
  return moment(dateTime).isAfter(now, "minutes") || moment(dateTime).isSame(now, "minutes");
};

export const isPlannedTimeBefore = (selectedTime: Date | undefined, previousTimes: Date[], granularity: unitOfTime.StartOf): boolean => {
  if (!selectedTime || previousTimes.length === 0) {
    return false;
  }
  const selected = moment(selectedTime);

  return previousTimes.some((prev) => {
    return selected.isBefore(moment(prev), granularity);
  });
};
