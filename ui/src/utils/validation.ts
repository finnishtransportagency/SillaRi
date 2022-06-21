import moment from "moment";
import IPermit from "../interfaces/IPermit";
import IRouteTransport from "../interfaces/IRouteTransport";
import { SupervisionStatus, TransportStatus } from "./constants";
import { unitOfTime } from "moment/moment";
import { constructTimesForComparison } from "./managementUtil";
import ISupervision from "../interfaces/ISupervision";
import ISupervisionReport from "../interfaces/ISupervisionReport";

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
      return !!supervision.plannedTime;
    });
  }
  // Ignore transports with no supervisions
  return true;
};

export const hasSupervisionStarted = (supervisions: ISupervision[]): boolean => {
  return (
    supervisions.length > 0 &&
    supervisions.some((supervision) => {
      const { currentStatus: currentSupervisionStatus } = supervision;
      const { status: supervisionStatus } = currentSupervisionStatus || {};
      // If supervision is new, it does not have a status yet
      return supervisionStatus && supervisionStatus !== SupervisionStatus.PLANNED;
    })
  );
};

export const isTransportEditable = (transport: IRouteTransport | undefined, permit: IPermit | undefined): boolean => {
  if (transport) {
    const { currentStatus, supervisions = [] } = transport;
    const { status } = currentStatus || {};
    const { isCurrentVersion = false } = permit || {};

    return isPermitValid(permit) && isCurrentVersion && status === TransportStatus.PLANNED && !hasSupervisionStarted(supervisions);
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

export const isSupervisionReportValid = (report: ISupervisionReport | undefined): boolean => {
  if (!report) {
    return false;
  }
  const {
    drivingLineOk,
    drivingLineInfo,
    speedLimitOk,
    speedLimitInfo,
    anomalies,
    anomaliesDescription,
    surfaceDamage,
    jointDamage,
    bendOrDisplacement,
    otherObservations,
    otherObservationsInfo,
  } = report;
  if (
    (!drivingLineOk && !drivingLineInfo) ||
    (!speedLimitOk && !speedLimitInfo) ||
    (anomalies && !anomaliesDescription && !surfaceDamage && !jointDamage && !bendOrDisplacement && !otherObservations)
  ) {
    return false;
  }
  return !(otherObservations && !otherObservationsInfo);
};
