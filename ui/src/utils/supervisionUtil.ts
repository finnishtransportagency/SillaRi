import moment from "moment";
import IRouteTransport from "../interfaces/IRouteTransport";
import ISupervision from "../interfaces/ISupervision";
import ISupervisionDay from "../interfaces/ISupervisionDay";
import ISupervisionReport from "../interfaces/ISupervisionReport";
import { SupervisionStatus, SupervisorType, TransportStatus } from "./constants";
import ISupervisionStatus from "../interfaces/ISupervisionStatus";
import { Moment } from "moment/moment";

export const getReportSignedTime = (supervision: ISupervision): Date | undefined => {
  const { statusHistory = [] } = supervision;

  // Find the first status in history with REPORT_SIGNED
  const signedStatus = statusHistory.find((st) => {
    const { status } = st;
    return status === SupervisionStatus.REPORT_SIGNED;
  });
  const { time: signedTime } = signedStatus || {};
  return signedTime;
};

export const groupSupervisionsByDate = (
  supervisions: ISupervision[] | undefined,
  compareDates: (arg0: ISupervision, arg1: ISupervisionDay) => boolean,
  createSupervisionDay: (arg0: ISupervision) => ISupervisionDay
): ISupervisionDay[] => {
  const supervisionDays: ISupervisionDay[] = [];

  if (supervisions && supervisions.length > 0) {
    supervisions.forEach((supervision) => {
      const existingDayMatch: ISupervisionDay[] = supervisionDays.filter((supervisionDay) => {
        return compareDates(supervision, supervisionDay);
      });
      // Should be only one match if found
      if (existingDayMatch.length > 0) {
        existingDayMatch[0].supervisions.push(supervision);
      } else {
        const newSupervisionDay = createSupervisionDay(supervision);
        supervisionDays.push(newSupervisionDay);
      }
    });

    // Since the dates include times, sorting by days can give a diff of 0 if the times on different days are less than 24 hours apart
    // So use startOf to use the time as 00:00 and get the correct day order
    supervisionDays.sort((a, b) => moment(a.date).startOf("day").diff(moment(b.date).startOf("day"), "days"));
  }
  return supervisionDays;
};

const getDisplayedDate = (supervision: ISupervision) => {
  // Get the date and time displayed to the user, so the planned time or actual time depending on the status
  const { currentStatus, startedTime, plannedTime } = supervision || {};
  const { status } = currentStatus || {};
  return status === SupervisionStatus.PLANNED ? plannedTime : startedTime;
};

export const groupSupervisionsByPlannedDate = (supervisions: ISupervision[] | undefined): ISupervisionDay[] => {
  const compareDates = (supervision: ISupervision, supervisionDay: ISupervisionDay) => {
    return moment(getDisplayedDate(supervision)).isSame(moment(supervisionDay.date), "day");
  };

  const createSupervisionDay = (supervision: ISupervision): ISupervisionDay => {
    return { date: moment(getDisplayedDate(supervision)).startOf("day").toDate(), supervisions: [supervision] };
  };

  return groupSupervisionsByDate(supervisions, compareDates, createSupervisionDay);
};

export const groupSupervisionsBySignedDate = (supervisions: ISupervision[] | undefined): ISupervisionDay[] => {
  const compareDates = (supervision: ISupervision, supervisionDay: ISupervisionDay) => {
    const signedTime = getReportSignedTime(supervision);
    return moment(signedTime).isSame(moment(supervisionDay.date), "day");
  };

  const createSupervisionDay = (supervision: ISupervision): ISupervisionDay => {
    const signedTime = getReportSignedTime(supervision);
    return { date: moment(signedTime).startOf("day").toDate(), supervisions: [supervision] };
  };

  const supervisionDays = groupSupervisionsByDate(supervisions, compareDates, createSupervisionDay);
  return supervisionDays.reverse();
};

const sortByBridgeOrder = (a: ISupervision, b: ISupervision) => {
  // Sort supervisions by first routeTransportId and then bridge ordinal
  const { routeBridge: bridgeA, routeTransportId: transportA } = a;
  const { routeBridge: bridgeB, routeTransportId: transportB } = b;
  if (transportA === transportB) {
    const { ordinal: ordinalA = -1 } = bridgeA || {};
    const { ordinal: ordinalB = -1 } = bridgeB || {};
    return ordinalA - ordinalB;
  }
  return transportA - transportB;
};

export const sortSupervisionsByBridgeOrder = (supervisions: ISupervision[] | undefined): void => {
  if (supervisions && supervisions.length > 0) {
    supervisions.sort(sortByBridgeOrder);
  }
};

export const sortSupervisionsByTimeAndBridgeOrder = (supervisions: ISupervision[] | undefined): void => {
  if (supervisions && supervisions.length > 0) {
    supervisions.sort((a, b) => {
      // Sort using the same time as displayed to the user, so use the planned time or actual time depending on the status
      // Similar to the supervisionDays sort issue above, use startOf to use the time without seconds to get the correct order
      const timeA = getDisplayedDate(a);
      const timeB = getDisplayedDate(b);
      const timeDiff = moment(timeA).startOf("minute").diff(moment(timeB).startOf("minute"), "minutes");

      // Sort supervisions with the same time by first routeTransportId and then bridge ordinal
      return timeDiff === 0 ? sortByBridgeOrder(a, b) : timeDiff;
    });
  }
};

export const sortSentSupervisions = (supervisions: ISupervision[] | undefined): void => {
  if (supervisions && supervisions.length > 0) {
    supervisions.sort((a, b) => {
      const timeA = getReportSignedTime(a);
      const timeB = getReportSignedTime(b);
      const timeDiff = moment(timeA).startOf("minute").diff(moment(timeB).startOf("minute"), "minutes");
      // Sort supervisions with the same time by first routeTransportId and then bridge ordinal
      return timeDiff === 0 ? sortByBridgeOrder(a, b) : timeDiff;
    });
    // Sort the latest first - reverse also those sorted by bridge order, so it follows the same logic
    supervisions.reverse();
  }
};

export const isSupervisionSigned = (statusHistory: ISupervisionStatus[]) => {
  return (
    statusHistory.length > 0 &&
    statusHistory.some((st) => {
      const { status } = st || {};
      return status === SupervisionStatus.REPORT_SIGNED;
    })
  );
};

export const reportHasUnsavedChanges = (modified: ISupervisionReport | undefined, saved: ISupervisionReport | undefined): boolean => {
  if (modified === undefined) {
    return false;
  }
  if (saved === undefined || saved === null) {
    return true;
  }
  if (
    modified.drivingLineOk !== saved.drivingLineOk ||
    modified.speedLimitOk !== saved.speedLimitOk ||
    modified.anomalies !== saved.anomalies ||
    modified.additionalInfo !== saved.additionalInfo
  ) {
    return true;
  }
  return (
    (!modified.drivingLineOk && modified.drivingLineInfo !== saved.drivingLineInfo) ||
    (!modified.speedLimitOk && modified.speedLimitInfo !== saved.speedLimitInfo) ||
    (modified.anomalies &&
      (modified.anomaliesDescription !== saved.anomaliesDescription ||
        modified.surfaceDamage !== saved.surfaceDamage ||
        modified.jointDamage !== saved.jointDamage ||
        modified.bendOrDisplacement !== saved.bendOrDisplacement ||
        modified.otherObservations !== saved.otherObservations ||
        (modified.otherObservations && modified.otherObservationsInfo !== saved.otherObservationsInfo)))
  );
};

export const getNextPlannedSupervisionTime = (supervisions: ISupervision[]): Moment | undefined => {
  // Ignore ongoing supervisions
  const plannedTimes = supervisions
    .filter((s) => {
      const { currentStatus } = s || {};
      const { status } = currentStatus || {};
      return status === SupervisionStatus.PLANNED || status === SupervisionStatus.CANCELLED;
    })
    .map((s) => moment(s.plannedTime).startOf("minute"));
  return plannedTimes.length > 0 ? moment.min(plannedTimes) : undefined;
};

export const getNextSupervisionTimeForCompany = (transports: IRouteTransport[]): Date | undefined => {
  const timesPerTransport: Moment[] = [];
  transports.forEach((transport) => {
    const { supervisions = [] } = transport;
    const nextPlannedTime = getNextPlannedSupervisionTime(supervisions);
    if (nextPlannedTime !== undefined) {
      timesPerTransport.push(moment(nextPlannedTime));
    }
  });
  return timesPerTransport.length > 0 ? moment.min(timesPerTransport).toDate() : undefined;
};

export const getTransportTime = (transport: IRouteTransport): Date | undefined => {
  const { plannedDepartureTime, statusHistory = [] } = transport;
  const departedStatus = statusHistory.filter((history) => {
    return history.status === TransportStatus.DEPARTED;
  });
  return departedStatus.length > 0 ? departedStatus[0].time : plannedDepartureTime;
};

export const isCustomerUsesSillariPermitSupervision = (supervision: ISupervision): boolean => {
  console.log("isCustomerUsesSillariPermitSupervision " + supervision.id);
  const { routeBridge } = supervision;
  if (routeBridge) {
    const { route } = routeBridge;
    if (route) {
      const { permit } = route;
      if (permit) {
        console.log(permit.customerUsesSillari);
        if (permit.customerUsesSillari === undefined) {
          console.log("customerUsesSillari is undefined, we treat that false");
          return false;
        } else {
          console.log("customerUsesSillari not undefined, we return " + permit.customerUsesSillari);
          return permit.customerUsesSillari;
        }
        return permit.customerUsesSillari;
      }
    } else {
      console.log(
        "Supervision routebridge  doesn't have route. Should not happen. Could not see if parmit is customer uses sillari. We use supervision.supervisorType instaed which migth be wronb with old supervisions. " +
          supervision.id
      );
    }
  } else {
    console.log(
      "Supervision doesn't have route bridge. Should not happen. Could not see if parmit is customer uses sillari. We use supervision.supervisorType instaed which migth be wronb with old supervisions. " +
        supervision.id
    );
  }
  return !(supervision.supervisorType === SupervisorType.AREA_CONTRACTOR);
};
