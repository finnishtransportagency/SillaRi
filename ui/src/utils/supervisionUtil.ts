import ISupervision from "../interfaces/ISupervision";
import ISupervisionDay from "../interfaces/ISupervisionDay";
import moment from "moment";
import ISupervisionReport from "../interfaces/ISupervisionReport";

export const groupSupervisionsByDate = (supervisions: ISupervision[] | undefined): ISupervisionDay[] => {
  const supervisionDays: ISupervisionDay[] = [];

  if (supervisions && supervisions.length > 0) {
    supervisions.forEach((supervision) => {
      const existingDayMatch: ISupervisionDay[] = supervisionDays.filter((supervisionDay) => {
        return moment(supervision.plannedTime).isSame(moment(supervisionDay.date), "day");
      });
      // Should be only one match if found
      if (existingDayMatch.length > 0) {
        existingDayMatch[0].supervisions.push(supervision);
      } else {
        const newSupervisionDay: ISupervisionDay = { date: supervision.plannedTime, supervisions: [supervision] };
        supervisionDays.push(newSupervisionDay);
      }
    });
    supervisionDays.sort((a, b) => moment(a.date).diff(moment(b.date), "days"));
  }
  return supervisionDays;
};

export const sortSupervisionsByTimeAndBridgeOrder = (supervisions: ISupervision[] | undefined): void => {
  if (supervisions && supervisions.length > 0) {
    supervisions.sort((a, b) => {
      const timeDiff = moment(a.plannedTime).diff(moment(b.plannedTime), "minutes");
      if (timeDiff === 0) {
        // Sort supervisions with the same planned time by first routeTransportId and then bridge ordinal
        const { routeBridge: bridgeA, routeTransportId: transportA } = a;
        const { routeBridge: bridgeB, routeTransportId: transportB } = b;
        if (transportA === transportB) {
          const { ordinal: ordinalA = -1 } = bridgeA || {};
          const { ordinal: ordinalB = -1 } = bridgeB || {};
          return ordinalA - ordinalB;
        }
        return transportA - transportB;
      }
      return timeDiff;
    });
  }
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
