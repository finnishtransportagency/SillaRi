import { QueryClient } from "react-query";
import type { Dispatch } from "redux";
import IRouteTransport from "../interfaces/IRouteTransport";
import ISupervision from "../interfaces/ISupervision";
import {
  getCompanyTransportsList,
  getRouteTransportOfSupervisor,
  getSupervisionWithPassCode,
  getSupervisionList,
  getSupervisionListAreaContractor,
  getSupervisionNoPasscode,
  getSupervisionSendingList,
} from "./supervisionBackendData";
import { getUserData, onRetry } from "./backendData";
import { SupervisionListType } from "./constants";
import { getPasswordAndIdFromStorage } from "./trasportCodeStorageUtil";
import IKeyValue from "../interfaces/IKeyValue";
import ICompanyTransports from "../interfaces/ICompanyTransports";

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
      return queryClient.prefetchQuery(["getSupervision", Number(kv.key)], () => getSupervisionWithPassCode(kv.key, username, kv.value, dispatch), {
        retry: onRetry,
        staleTime: Infinity,
      });
    })
  );
};

const prefetchSupervisionsNoPasscode = async (supervisionList: ISupervision[], queryClient: QueryClient, dispatch: Dispatch) => {
  await Promise.all(
    supervisionList.map((s) => {
      return queryClient.prefetchQuery(["getSupervision", Number(s.id)], () => getSupervisionNoPasscode(s.id, dispatch), {
        retry: onRetry,
        staleTime: Infinity,
      });
    })
  );
};

export const prefetchSupervisionsNoPasscodeWithIds = async (supervisionIdsList: number[], queryClient: QueryClient, dispatch: Dispatch) => {
  await Promise.all(
    supervisionIdsList.map((id) => {
      return queryClient.prefetchQuery(["getSupervision", id], () => getSupervisionNoPasscode(id, dispatch), {
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
            () => getSupervisionWithPassCode(supervisionId, username, transportCode, dispatch),
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
    queryClient.fetchQuery(["getSupervisionList"], () => getSupervisionList(dispatch), {
      retry: onRetry,
      staleTime: Infinity,
    }),
    queryClient.fetchQuery(["getSupervisionListAreaContractor"], () => getSupervisionListAreaContractor(dispatch), {
      retry: onRetry,
      staleTime: Infinity,
    }),
  ]);

  console.log("PREFETCHED MAINDATA", mainData);
  const { username } = mainData[0] || {};
  const companyTransportsList = mainData[1];
  const supervisionSendingList = mainData[2];
  const supervisionsCompanyUsesSillari = mainData[4];

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
    // getSupervisions that are companyUsesSillari == false, they are not under routeTransports and dont require passcode
    prefetchSupervisionsNoPasscode(supervisionsCompanyUsesSillari, queryClient, dispatch),
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
