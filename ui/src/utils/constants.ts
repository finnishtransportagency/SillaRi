export const DATE_FORMAT = "DD.MM.YYYY";
export const DATE_TIME_FORMAT = "DD.MM.YYYY HH:mm:ss";
export const DATE_TIME_FORMAT_MIN = "DD.MM.YYYY HH:mm";

export enum SupervisionStatus {
  PLANNED = "PLANNED",
  IN_PROGRESS = "IN_PROGRESS",
  CANCELLED = "CANCELLED",
  FINISHED = "FINISHED",
}

export enum SupervisorType {
  OWN_SUPERVISOR = "OWN_SUPERVISOR",
  AREA_CONTRACTOR = "AREA_CONTRACTOR",
}

export enum TransportStatus {
  PLANNED = "PLANNED",
  DEPARTED = "DEPARTED",
  STOPPED = "STOPPED",
  IN_PROGRESS = "IN_PROGRESS",
  ARRIVED = "ARRIVED",
}
