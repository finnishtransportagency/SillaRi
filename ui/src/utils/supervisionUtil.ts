import { QueryClient } from "react-query";
import type { Dispatch } from "redux";
import moment from "moment";
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
import { SupervisionListType, SupervisionStatus, TransportStatus } from "./constants";
import ISupervisionStatus from "../interfaces/ISupervisionStatus";
import { Moment } from "moment/moment";
import { getPasswordAndIdFromStorage } from "./trasportCodeStorageUtil";
import IKeyValue from "../interfaces/IKeyValue";
import ICompanyTransports from "../interfaces/ICompanyTransports";

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

const prefetchSupervisions = async (supervisionList: ISupervision[], username: string, queryClient: QueryClient, dispatch: Dispatch) => {
  // Get transportCodes from storage for each supervisionId
  const idsAndTransportCodes: IKeyValue[] = await Promise.all(
    supervisionList.map((supervision) => {
      return getPasswordAndIdFromStorage(username, SupervisionListType.BRIDGE, supervision.id);
    })
  );

  // Filter missing transportCodes - we don't want to try to fetch them from backend and get forbidden error
  const filteredIdsAndCodes = idsAndTransportCodes.filter((kv) => !!kv.value);

  await Promise.all(
    filteredIdsAndCodes.map((kv) => {
      return queryClient.prefetchQuery(["getSupervision", Number(kv.key)], () => getSupervision(kv.key, username, kv.value, dispatch), {
        retry: onRetry,
        staleTime: Infinity,
      });
    })
  );
};

const prefetchRouteTransports = async (
  companyTransportsList: ICompanyTransports[],
  username: string,
  queryClient: QueryClient,
  dispatch: Dispatch
) => {
  const completeTransportList = companyTransportsList.flatMap((companyTransports) => {
    const { transports = [] } = companyTransports || {};
    return transports;
  });

  // Get transportCodes for each routeTransportId from storage
  const transportIdsAndCodes: IKeyValue[] = await Promise.all(
    completeTransportList.map((transport) => {
      const { id: routeTransportId } = transport || {};
      return getPasswordAndIdFromStorage(username, SupervisionListType.TRANSPORT, routeTransportId);
    })
  );

  // Filter missing transportCodes - we don't want to try to fetch them from backend
  const filteredIdsAndCodes = transportIdsAndCodes.filter((kv) => !!kv.value);

  const routeTransports = await Promise.all(
    filteredIdsAndCodes.map((kv) => {
      return queryClient.fetchQuery(
        ["getRouteTransportOfSupervisor", Number(kv.key)],
        () => getRouteTransportOfSupervisor(kv.key, username, kv.value, dispatch),
        {
          retry: onRetry,
          staleTime: Infinity,
        }
      );
    })
  );

  console.log("PREFETCHED routeTransports", routeTransports);

  // Prefetch the supervisions of each route transport that has been unlocked
  if (routeTransports.length > 0) {
    // If route transport is unlocked, all of its supervisions are unlocked as well
    // No need to check from storage, use the transportCode fetched previously for route transport
    await Promise.all(
      routeTransports.flatMap((routeTransport) => {
        const { id: routeTransportId, supervisions = [] } = routeTransport || {};
        const matchingTransportCode = filteredIdsAndCodes.find((kv) => kv.key === routeTransportId);
        const transportCode = matchingTransportCode ? matchingTransportCode.value : null;

        return supervisions.map((supervision) => {
          const { id: supervisionId } = supervision || {};

          return queryClient.prefetchQuery(
            ["getSupervision", Number(supervisionId)],
            () => getSupervision(supervisionId, username, transportCode, dispatch),
            {
              retry: onRetry,
              staleTime: Infinity,
            }
          );
        });
      })
    );
  }

  // If routeTransport is locked (no data fetched), fetch those supervisions separately that have transportCode in storage
  const lockedTransports = completeTransportList.filter((transport) => {
    const routeTransportMatch = routeTransports.find((rt) => rt.id === transport.id);
    return routeTransportMatch === undefined;
  });

  if (lockedTransports.length > 0) {
    const supervisionList = lockedTransports.flatMap((transport) => {
      const { supervisions = [] } = transport || {};
      return supervisions;
    });

    await prefetchSupervisions(supervisionList, username, queryClient, dispatch);
  }
};

export const prefetchOfflineData = async (queryClient: QueryClient, dispatch: Dispatch) => {
  // Prefetch all data needed for supervisions so that the application can subsequently be used offline
  // Use queryClient.prefetchQuery where possible but only for query data that is not needed by other queries, only fetchQuery returns a result
  // Make sure the parameter types match the later useQuery calls, otherwise the caching doesn't work!

  // Prefetch the main data, but only return data needed by the next steps
  const mainData = await Promise.all([
    queryClient.fetchQuery(["getSupervisor"], () => getUserData(dispatch), {
      retry: onRetry,
      staleTime: Infinity,
    }),
    queryClient.fetchQuery(["getCompanyTransportsList"], () => getCompanyTransportsList(dispatch), {
      retry: onRetry,
      staleTime: Infinity,
    }),
    queryClient.fetchQuery(["getSupervisionSendingList"], () => getSupervisionSendingList(dispatch), {
      retry: onRetry,
      staleTime: Infinity,
    }),
    queryClient.prefetchQuery(["getSupervisionList"], () => getSupervisionList(dispatch), {
      retry: onRetry,
      staleTime: Infinity,
    }),
  ]);

  console.log("PREFETCHED MAINDATA", mainData);
  const { username } = mainData[0] || {};
  const companyTransportsList = mainData[1];
  const supervisionSendingList = mainData[2];

  // Fetch only routeTransports and supervisions that have the password in storage
  // Otherwise query fails, and we don't get any routeTransports or supervisions in the cache for offline use
  // TODO could also fetch everything but then we cannot throw the error from backend, because it does not resolve the promise
  // but throws the error, and we cannot proceed to get the supervisions for the resolved routeTransports if another routeTransport fails
  await Promise.all([
    // getRouteTransportOfSupervisor for each route transport on CompanyTransportsList
    // and getSupervision for each supervision on supervisor's list (transport list or bridge list)
    prefetchRouteTransports(companyTransportsList, username, queryClient, dispatch),
    // getSupervision for each supervision on the sending list, so that the modify button and report modal work offline
    prefetchSupervisions(supervisionSendingList, username, queryClient, dispatch),
  ]);
};

export const removeSupervisionFromRouteTransportList = (queryClient: QueryClient, routeTransportId: string, supervisionId: string) => {
  // Remove the finished/denied supervision from the UI when using cached data
  // This is a more efficient way than invalidating all queries to refetch everything
  const routeTransport = queryClient.getQueryData<IRouteTransport>(["getRouteTransportOfSupervisor", Number(routeTransportId)]);
  if (routeTransport && routeTransport.supervisions) {
    routeTransport.supervisions = routeTransport.supervisions.reduce((acc: ISupervision[], s) => {
      return s.id === Number(supervisionId) ? acc : [...acc, s];
    }, []);
    queryClient.setQueryData(["getRouteTransportOfSupervisor", Number(routeTransportId)], routeTransport);
  }

  // Make sure the supervision is also removed from the bridges list on the main page
  const supervisionList = queryClient.getQueryData<ISupervision[]>(["getSupervisionList"]);
  if (supervisionList) {
    queryClient.setQueryData(
      ["getSupervisionList"],
      supervisionList.reduce((acc: ISupervision[], s) => {
        return s.id === Number(supervisionId) ? acc : [...acc, s];
      }, [])
    );
  }
};
