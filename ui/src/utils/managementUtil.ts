import ISupervision from "../interfaces/ISupervision";
import IRouteTransport from "../interfaces/IRouteTransport";
import ISortOrder from "../interfaces/ISortOrder";
import { TransportStatus } from "./constants";

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

export const sortTransports = (transports: IRouteTransport[], sortOrder: ISortOrder) => {
  const transportStatusOrder = [
    TransportStatus.PLANNED,
    TransportStatus.DEPARTED,
    TransportStatus.IN_PROGRESS,
    TransportStatus.STOPPED,
    TransportStatus.ARRIVED,
  ];

  const { column, direction } = sortOrder;

  transports.sort((a, b) => {
    const {
      tractorUnit: tractorA,
      route: routeA,
      plannedDepartureTime: plannedTimeA,
      departureTime: departureTimeA,
      currentStatus: currentStatusA,
    } = a;

    const {
      tractorUnit: tractorB,
      route: routeB,
      plannedDepartureTime: plannedTimeB,
      departureTime: departureTimeB,
      currentStatus: currentStatusB,
    } = b;

    switch (column) {
      case "tractor": {
        return tractorA.localeCompare(tractorB);
      }
      case "route": {
        const { name: nameA = "" } = routeA || {};
        const { name: nameB = "" } = routeB || {};
        return nameA.localeCompare(nameB);
      }
      /*case "time": {
        const { status: statusA } = currentStatusA || {};
        const { status: statusB } = currentStatusB || {};
      }*/
      case "status": {
        const { status: statusA } = currentStatusA || {};
        const { status: statusB } = currentStatusB || {};
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

  if (direction === "DESC") {
    transports.reverse();
  }
};
