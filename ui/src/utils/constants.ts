export const DATE_FORMAT = "DD.MM.YYYY";
export const TIME_FORMAT_MIN = "HH:mm";
export const DATE_TIME_FORMAT = "DD.MM.YYYY HH:mm:ss";
export const DATE_TIME_FORMAT_MIN = "DD.MM.YYYY HH:mm";

export const REACT_QUERY_CACHE_TIME = 1000 * 60 * 60 * 24; // 24 hours
// export const REACT_QUERY_CACHE_TIME = 1000 * 30; // 30 seconds, for testing

export const NETWORK_RESPONSE_NOT_OK = "Network response was not ok";
export const FORBIDDEN_ERROR = "Forbidden";
export const CONFLICT_ERROR = "Conflict";

export const TRANSPORT_CODE_STORAGE_GROUP = "sillari_transcode";

export enum SillariErrorCode {
  NO_USER_ROLES = 1001,
  NO_USER_DATA = 1002,
  OTHER_USER_FETCH_ERROR = 1003,
}

export enum SupervisionStatus {
  PLANNED = "PLANNED",
  IN_PROGRESS = "IN_PROGRESS",
  CANCELLED = "CANCELLED",
  FINISHED = "FINISHED",
  CROSSING_DENIED = "CROSSING_DENIED",
  REPORT_SIGNED = "REPORT_SIGNED",
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

export enum VehicleRole {
  TRUCK = "TRUCK",
  TRAILER = "TRAILER",
  PUSHING_VEHICLE = "PUSHING_VEHICLE",
}

export enum SupervisionListType {
  TRANSPORT = "TRANSPORT",
  BRIDGE = "BRIDGE",
}
