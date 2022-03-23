import { QueryClient } from "react-query";
import type { Dispatch } from "redux";
import moment from "moment";
import ICompanyTransports from "../interfaces/ICompanyTransports";
import IRouteTransport from "../interfaces/IRouteTransport";
import ISupervision from "../interfaces/ISupervision";
import ISupervisionDay from "../interfaces/ISupervisionDay";
import ISupervisionReport from "../interfaces/ISupervisionReport";
import {
  getCompanyTransportsList,
  getRouteTransportOfSupervisor,
  getSupervision,
  getSupervisionList,
  getSupervisionSendingList,
} from "./supervisionBackendData";
import { getUserData, onRetry } from "./backendData";
import { SupervisionStatus } from "./constants";
import ISupervisionStatus from "../interfaces/ISupervisionStatus";

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

export const groupSupervisionsByPlannedDate = (supervisions: ISupervision[] | undefined): ISupervisionDay[] => {
  const compareDates = (supervision: ISupervision, supervisionDay: ISupervisionDay) => {
    return moment(supervision.plannedTime).isSame(moment(supervisionDay.date), "day");
  };

  const createSupervisionDay = (supervision: ISupervision): ISupervisionDay => {
    return { date: moment(supervision.plannedTime).startOf("day").toDate(), supervisions: [supervision] };
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

  return groupSupervisionsByDate(supervisions, compareDates, createSupervisionDay);
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
      const { currentStatus: currentStatusA, startedTime: startedTimeA, plannedTime: plannedTimeA } = a || {};
      const { currentStatus: currentStatusB, startedTime: startedTimeB, plannedTime: plannedTimeB } = b || {};
      const { status: supervisionStatusA } = currentStatusA || {};
      const { status: supervisionStatusB } = currentStatusB || {};

      // Sort using the same time as displayed to the user, so use the planned time or actual time depending on the status
      // Similar to the supervisionDays sort issue above, use startOf to use the time without seconds to get the correct order
      const timeA = supervisionStatusA === SupervisionStatus.PLANNED ? plannedTimeA : startedTimeA;
      const timeB = supervisionStatusB === SupervisionStatus.PLANNED ? plannedTimeB : startedTimeB;
      const timeDiff = moment(timeA).startOf("minute").diff(moment(timeB).startOf("minute"), "minutes");

      // Sort supervisions with the same time by first routeTransportId and then bridge ordinal
      return timeDiff === 0 ? sortByBridgeOrder(a, b) : timeDiff;
    });
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

export const prefetchOfflineData = async (queryClient: QueryClient, dispatch: Dispatch) => {
  // Prefetch all data needed for supervisions so that the application can subsequently be used offline
  // Use queryClient.prefetchQuery where possible but only for query data that is not needed by other queries
  // Make sure the parameter types match the later useQuery calls, otherwise the caching doesn't work!

  // Prefetch the main data, but only return the company transports data needed by the next step
  const mainData = await Promise.all([
    queryClient.fetchQuery(["getCompanyTransportsList"], () => getCompanyTransportsList(dispatch), {
      retry: onRetry,
      staleTime: Infinity,
    }),
    queryClient.prefetchQuery(["getSupervisionList"], () => getSupervisionList(dispatch), {
      retry: onRetry,
      staleTime: Infinity,
    }),
    queryClient.prefetchQuery(["getSupervisionSendingList"], () => getSupervisionSendingList(dispatch), {
      retry: onRetry,
      staleTime: Infinity,
    }),
    queryClient.prefetchQuery(["getSupervisor"], () => getUserData(dispatch), {
      retry: onRetry,
      staleTime: Infinity,
    }),
  ]);

  // Prefetch the route transports of each company transport
  const companyTransportsList = mainData[0];
  const routeTransports = await Promise.all(
    companyTransportsList.flatMap((companyTransports) => {
      const { transports } = companyTransports || {};

      return transports.map((transport) => {
        const { id: routeTransportId } = transport || {};

        return queryClient.fetchQuery(
          ["getRouteTransportOfSupervisor", Number(routeTransportId)],
          () => getRouteTransportOfSupervisor(routeTransportId, dispatch),
          {
            retry: onRetry,
            staleTime: Infinity,
          }
        );
      });
    })
  );

  // Prefetch the supervisions of each route transport
  await Promise.all(
    routeTransports.flatMap((routeTransport) => {
      const { supervisions = [] } = routeTransport || {};

      return supervisions.map((supervision) => {
        const { id: supervisionId } = supervision || {};

        return queryClient.prefetchQuery(["getSupervision", Number(supervisionId)], () => getSupervision(supervisionId, dispatch), {
          retry: onRetry,
          staleTime: Infinity,
        });
      });
    })
  );
};

export const invalidateOfflineData = (queryClient: QueryClient, dispatch: Dispatch) => {
  // Invalidate the queries to force UI updates when using cached data
  // Do this for the data that was fetched by prefetchOfflineData, rather than invalidating everything
  // TODO - figure out a better way to do this when offline
  const companyTransportsList = queryClient.getQueryData<ICompanyTransports[]>(["getCompanyTransportsList"]) || [];

  companyTransportsList.forEach((companyTransports) => {
    const { transports } = companyTransports || {};

    transports.forEach((transport) => {
      const { id: routeTransportId } = transport || {};

      const routeTransport = queryClient.getQueryData<IRouteTransport>(["getRouteTransportOfSupervisor", Number(routeTransportId)]);

      const { supervisions = [] } = routeTransport || {};
      supervisions.forEach((supervision) => {
        const { id: supervisionId } = supervision || {};
        queryClient.invalidateQueries(["getSupervision", Number(supervisionId)]);
      });

      queryClient.invalidateQueries(["getRouteTransportOfSupervisor", Number(routeTransportId)]);
    });
  });

  queryClient.invalidateQueries(["getCompanyTransportsList"]);
  queryClient.invalidateQueries(["getSupervisionList"]);
  queryClient.invalidateQueries(["getSupervisionSendingList"]);
  queryClient.invalidateQueries(["getSupervisor"]);

  // Repopulate the cache after invalidating
  prefetchOfflineData(queryClient, dispatch);
};
