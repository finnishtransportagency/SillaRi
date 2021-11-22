import ISupervision from "../interfaces/ISupervision";
import ISupervisionDay from "../interfaces/ISupervisionDay";
import moment from "moment";
import ISupervisionReport from "../interfaces/ISupervisionReport";
import IImageItem from "../interfaces/IImageItem";
import ISupervisionImage from "../interfaces/ISupervisionImage";
import { SupervisionStatus } from "./constants";

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

export const filterFinishedSupervisions = (supervisions: ISupervision[] | undefined): ISupervision[] => {
  const visibleStatusTypes = [SupervisionStatus.PLANNED, SupervisionStatus.IN_PROGRESS, SupervisionStatus.CANCELLED];
  if (supervisions && supervisions.length > 0) {
    return supervisions.filter((supervision) => {
      return supervision.currentStatus && visibleStatusTypes.includes(supervision.currentStatus.status);
    });
  }
  return [];
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

export const filterUnsavedImages = (cameraImages: IImageItem[], savedImages: ISupervisionImage[]): IImageItem[] => {
  return cameraImages.reduce((acc: IImageItem[], image) => {
    const isImageSaved = savedImages.some((savedImage) => savedImage.filename === image.filename);
    return isImageSaved ? acc : [...acc, image];
  }, []);
};
