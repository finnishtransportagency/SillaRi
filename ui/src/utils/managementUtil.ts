import ISupervision from "../interfaces/ISupervision";
import IRouteTransport from "../interfaces/IRouteTransport";
import ISortOrder from "../interfaces/ISortOrder";
import { TransportStatus } from "./constants";
import IRouteTransportStatus from "../interfaces/IRouteTransportStatus";
import moment from "moment";
import { Moment } from "moment/moment";

export const constructTimesForComparison = (departureTime: Date | undefined, supervisions: ISupervision[], currentIndex: number): Date[] => {
  const dates: Date[] = [];
  if (departureTime) {
    dates.push(departureTime);
  }
  supervisions.forEach((supervision, index) => {
    if (index < currentIndex) {
      const { plannedTime } = supervision;
      if (plannedTime) {
        dates.push(plannedTime);
      }
    }
  });
  return dates;
};

export const filterTransports = (transports: IRouteTransport[], filter: string): IRouteTransport[] => {
  return transports.filter((transport) => {
    const { currentStatus } = transport;
    const { status } = currentStatus || {};

    switch (filter) {
      case "planned": {
        return status === TransportStatus.PLANNED;
      }
      case "in_progress": {
        return status === TransportStatus.DEPARTED || status === TransportStatus.STOPPED || status === TransportStatus.IN_PROGRESS;
      }
      case "completed": {
        return status === TransportStatus.ARRIVED;
      }
      default: {
        return true;
      }
    }
  });
};

export const getTransportDepartureTime = (statusHistory: IRouteTransportStatus[]): Moment | undefined => {
  const departedStatus = statusHistory.filter((history) => {
    return history.status === TransportStatus.DEPARTED;
  });
  return departedStatus.length > 0 ? moment(departedStatus[0].time) : undefined;
};

export const sortTransports = (transports: IRouteTransport[], sortOrder: ISortOrder) => {
  const transportStatusOrder = [
    TransportStatus.PLANNED,
    TransportStatus.DEPARTED,
    TransportStatus.IN_PROGRESS,
    TransportStatus.STOPPED,
    TransportStatus.ARRIVED,
  ];

  const { column, ascending } = sortOrder;

  transports.sort((a, b) => {
    const {
      tractorUnit: tractorA,
      route: routeA,
      plannedDepartureTime: plannedTimeA,
      currentStatus: currentStatusA,
      statusHistory: statusHistoryA = [],
    } = a;

    const {
      tractorUnit: tractorB,
      route: routeB,
      plannedDepartureTime: plannedTimeB,
      currentStatus: currentStatusB,
      statusHistory: statusHistoryB = [],
    } = b;

    const { status: statusA } = currentStatusA || {};
    const { status: statusB } = currentStatusB || {};

    switch (column) {
      case "tractor": {
        return tractorA.localeCompare(tractorB);
      }
      case "route": {
        const { name: nameA = "" } = routeA || {};
        const { name: nameB = "" } = routeB || {};
        return nameA.localeCompare(nameB);
      }
      case "time": {
        const departureTimeA = getTransportDepartureTime(statusHistoryA);
        const departureTimeB = getTransportDepartureTime(statusHistoryB);
        const visibleTimeA = statusA === TransportStatus.PLANNED ? plannedTimeA : departureTimeA;
        const visibleTimeB = statusB === TransportStatus.PLANNED ? plannedTimeB : departureTimeB;
        return moment(visibleTimeA).diff(moment(visibleTimeB));
      }
      case "status": {
        const a1 = transportStatusOrder.findIndex((item) => item === statusA);
        const b1 = transportStatusOrder.findIndex((item) => item === statusB);
        if (a1 > b1) {
          return 1;
        }
        if (a1 < b1) {
          return -1;
        }
        return 0;
      }
      default: {
        return b.id - a.id;
      }
    }
  });

  if (!ascending) {
    transports.reverse();
  }
};

export const includesSupervisions = (routeTransports: IRouteTransport[] | undefined): boolean => {
  if (routeTransports) {
    return routeTransports.some((routeTransport) => {
      const { supervisions = [] } = routeTransport;
      return supervisions.length > 0;
    });
  }
  return false;
};
