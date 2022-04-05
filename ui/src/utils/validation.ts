import moment from "moment";
import IPermit from "../interfaces/IPermit";
import IRouteTransport from "../interfaces/IRouteTransport";
import { TransportStatus } from "./constants";
import { unitOfTime } from "moment/moment";
import { constructTimesForComparison } from "./managementUtil";
import ISupervision from "../interfaces/ISupervision";

export const isPermitValid = (permit: IPermit | undefined): boolean => {
  if (permit) {
    const { validEndDate } = permit;
    const end = moment(validEndDate);
    const now = moment();
    return !!validEndDate && end.isAfter(now);
  } else {
    return false;
  }
};

export const areSupervisionsValid = (supervisions: ISupervision[]): boolean => {
  if (supervisions.length > 0) {
    return supervisions.every((supervision) => {
      return !!supervision.plannedTime && !!supervision.supervisors && supervision.supervisors.length > 0;
    });
  }
  // Ignore transports with no supervisions
  return true;
};

export const isTransportEditable = (transport: IRouteTransport | undefined, permit: IPermit | undefined): boolean => {
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

export const hasSupervisionTimeErrors = (routeTransport: IRouteTransport): boolean => {
  const { plannedDepartureTime, supervisions = [] } = routeTransport || {};
  if (supervisions.length === 0) {
    return false;
  }
  const sortedSupervisions = supervisions.sort((a, b) => {
    const { ordinal: ordinalA = -1 } = a.routeBridge || {};
    const { ordinal: ordinalB = -1 } = b.routeBridge || {};
    return ordinalA - ordinalB;
  });
  return sortedSupervisions.some((s, index) => {
    const { plannedTime } = s;
    const previousTimes: Date[] = constructTimesForComparison(plannedDepartureTime, sortedSupervisions, index);
    return isPlannedTimeBefore(plannedTime, previousTimes, "minutes");
  });
};
