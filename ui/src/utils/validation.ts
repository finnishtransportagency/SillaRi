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
