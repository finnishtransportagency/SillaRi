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
