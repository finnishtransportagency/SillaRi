export const DATE_FORMAT = "DD.MM.YYYY";
export const TIME_FORMAT_MIN = "HH:mm";
export const DATE_TIME_FORMAT = "DD.MM.YYYY HH:mm:ss";
export const DATE_TIME_FORMAT_MIN = "DD.MM.YYYY HH:mm";

export const REACT_QUERY_CACHE_TIME = 1000 * 60 * 60 * 24; // 24 hours
// export const REACT_QUERY_CACHE_TIME = 1000 * 30; // 30 seconds, for testing
export const USER_DATA_POLL_INTERVAL = 1000 * 15; // 15 seconds
export const USER_DATA_AMPLIFIED_POLL_INTERVAL = 1000 * 2; // 2 seconds, this is used when logged out so we get logged in info sooner

export const NETWORK_RESPONSE_NOT_OK = "Network response was not ok";
export const FORBIDDEN_ERROR = "Forbidden";
export const CONFLICT_ERROR = "Conflict";

export const TRANSPORT_CODE_STORAGE_GROUP = "TRANSCODES";
export const TRANSPORT_CODE_STORAGE_LIFE_DAYS = 3;

export const OWNLIST_STORAGE_GROUP = "OWNLIST";

export const SILLARI_SYSTEM_USER = "SILLARI_SYSTEM";

export const BRIDGE_IMAGE_NOT_FOUND_DATA_URL =
  "data:image/png;base64,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";

export enum SillariErrorCode {
  NO_USER_ROLES = 1001,
  NO_USER_DATA = 1002,
  OTHER_USER_FETCH_ERROR = 1003,
}

export enum SupervisionStatus {
  PLANNED = "PLANNED",
  OWN_LIST_PLANNED = "OWN_LIST_PLANNED",
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
  OWNLIST = "OWNLIST",
}
