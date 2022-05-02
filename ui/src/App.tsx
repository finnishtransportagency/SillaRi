import React, { useCallback, useEffect, useState } from "react";
import { Redirect, Route, Switch } from "react-router-dom";
import { IonApp, IonButton, IonContent, setupIonicReact } from "@ionic/react";
import { IonReactRouter } from "@ionic/react-router";
import { Storage as IonicStorage } from "@ionic/storage";
import { withTranslation } from "react-i18next";
import { onlineManager, QueryClient, QueryClientProvider } from "react-query";
import { persistQueryClient } from "react-query/persistQueryClient-experimental";
import { createAsyncStoragePersistor } from "react-query/createAsyncStoragePersistor-experimental";
import { useDispatch } from "react-redux";
import Cookies from "js-cookie";
import Supervisions from "./pages/Supervisions";
import Settings from "./pages/Settings";
import Map from "./pages/Map";
import Supervision from "./pages/Supervision";
import RouteTransportDetail from "./pages/RouteTransportDetail";
import DenyCrossing from "./pages/DenyCrossing";
import BridgeDetail from "./pages/BridgeDetail";
import SupervisionSummary from "./pages/SupervisionSummary";
import CompanySummary from "./pages/management/CompanySummary";
import AddTransport from "./pages/management/AddTransport";
import TransportCodeInput from "./pages/transport/TransportCodeInput";
import Transport from "./pages/transport/Transport";
import TransportDetail from "./pages/management/TransportDetail";
import SidebarMenu from "./components/SidebarMenu";
import AccessDenied from "./pages/AccessDenied";
import IUserData from "./interfaces/IUserData";
import Photos from "./pages/Photos";
import UserInfo from "./pages/UserInfo";
import * as serviceWorkerRegistration from "./serviceWorkerRegistration";
import { useTypedSelector, RootState } from "./store/store";
import { getUserData, getVersionInfo } from "./utils/backendData";
import { REACT_QUERY_CACHE_TIME, SillariErrorCode } from "./utils/constants";
import { prefetchOfflineData } from "./utils/supervisionUtil";
import IonicAsyncStorage from "./IonicAsyncStorage";

/* Sillari.css */
import "./theme/sillari.css";

// Use the same style for all platforms
setupIonicReact({
  mode: "md",
});

// NOTE 1: the react-query client is currently using the default options as described here: https://react-query.tanstack.com/guides/important-defaults
// This means cached data is considered as stale, so data is always refetched, for example during page navigation or when the browser window gets focus
// The queries themselves are stored in the cache based on a query key (using the query parameters), and garbage collected after 5 minutes if not used again
// NOTE 2: to allow offline use for the supervisions app, staleTime must be set to something, such as Infinity to store data forever
// However, it should not be added here, since it affects the transport company and transport apps which are not used offline
// So instead use staleTime separately in the options of each query used by the supervisions app
// NOTE 3: use cacheTime to set how long data should be persisted in local storage, used when offline, which is a different concept than staleTime
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      cacheTime: REACT_QUERY_CACHE_TIME,
    },
  },
});

// NOTE 1: these persistence utilities are experimental in react-query v3 and subject to change
// However at time of writing, they have not changed for months, and v4 is in active development which will include proper versions
// The maxAge value is the same as the cacheTime value so garbage collection occurs at the expected time
// NOTE 2: using localStorage doesn't work well with supervision images due to size limitations and performance issues
// So use an AsyncStorage wrapper around Ionic Storage to store the data in IndexedDB instead, which solves these issues
const store = new IonicStorage();
store.create();
const asyncStoragePersistor = createAsyncStoragePersistor({ storage: IonicAsyncStorage(store) });
if (onlineManager.isOnline()) {
  // When online, clear the persisted data to always get the latest from the backend on application start-up
  asyncStoragePersistor.removeClient();
}
persistQueryClient({
  queryClient,
  persistor: asyncStoragePersistor,
  maxAge: REACT_QUERY_CACHE_TIME,
});

const App: React.FC = () => {
  const [userData, setUserData] = useState<IUserData>();
  const [homePage, setHomePage] = useState<string>("/supervisions");
  const [errorCode, setErrorCode] = useState<number>(0);
  const [version, setVersion] = useState<string>("-");
  const dispatch = useDispatch();

  const {
    networkStatus: { isFailed = {}, failedStatus = {} },
  } = useTypedSelector((state: RootState) => state.rootReducer);

  useEffect(() => {
    // Add or remove the "dark" class based on if the media query matches
    const toggleDarkTheme = (shouldAdd: boolean) => {
      document.body.classList.toggle("dark", shouldAdd);
    };

    // Use matchMedia to check the user preference
    const prefersDark = window.matchMedia("(prefers-color-scheme: dark)");

    toggleDarkTheme(prefersDark.matches);

    // Listen for changes to the prefers-color-scheme media query
    prefersDark.addEventListener("change", (mediaQuery) => toggleDarkTheme(mediaQuery.matches));

    const fetchUserData = async () => {
      try {
        const [userDataResponse, versionResponse] = await Promise.all([
          queryClient.fetchQuery(["getSupervisor"], () => getUserData(dispatch), {
            // retry: onRetry,
            staleTime: Infinity,
          }),
          queryClient.fetchQuery(["getVersionInfo"], () => getVersionInfo(dispatch), {
            // retry: onRetry,
            staleTime: Infinity,
          }),
        ]);

        if (!isFailed.getVersionInfo) {
          setVersion(versionResponse.version);
        }

        if (!failedStatus.getUserData || failedStatus.getUserData < 400) {
          if (userDataResponse.roles.length > 0) {
            if (userDataResponse.roles.includes("SILLARI_SILLANVALVOJA")) {
              setHomePage("/supervisions");
            } else if (userDataResponse.roles.includes("SILLARI_AJOJARJESTELIJA")) {
              setHomePage("/management");
            } else if (userDataResponse.roles.includes("SILLARI_KULJETTAJA")) {
              setHomePage("/transport");
            }
            setUserData(userDataResponse);
          } else {
            /* Should never happen, since backend returns 403, if user does not have SillaRi roles. */
            setErrorCode(SillariErrorCode.NO_USER_ROLES);
          }
        } else {
          // Note: status codes from the backend such as 401 or 403 are now contained in failedStatus.getUserData
          console.log("User data response", userDataResponse);
          setErrorCode(SillariErrorCode.NO_USER_DATA);
        }
      } catch (e) {
        console.log("App error", e);
        setErrorCode(SillariErrorCode.OTHER_USER_FETCH_ERROR);
      }
    };
    fetchUserData();

    // Fetch the user data on first render only, using a workaround utilising useEffect with empty dependency array
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const logoutFromApp = () => {
    serviceWorkerRegistration.unregister(() => {
      const cookies = Cookies.get();
      Object.keys(cookies).forEach((key) => {
        Cookies.remove(key);
      });
      window.location.reload();
    });
  };

  const userHasRole = useCallback(
    (role: string) => {
      if (userData) {
        return userData.roles.includes(role);
      }
      return false;
    },
    [userData]
  );

  const renderError = (code: number) => {
    // 401 - Returned by Väylä access control.
    // 403 - Returned by SillaRi backend if user does not have SillaRi roles.
    return (
      <>
        {code === 401 ? (
          <div>
            <h1>Pääsy estetty</h1>
            <p>Kirjaudu sisään käyttääksesi sovellusta.</p>
            <IonButton color="primary" expand="block" size="large" onClick={logoutFromApp}>
              Kirjaudu sisään
            </IonButton>
          </div>
        ) : code === 403 ? (
          <div>
            <h1>Pääsy estetty</h1>
            <p>Sinulla ei ole oikeuksia käyttää SillaRi-sovellusta.</p>
          </div>
        ) : (
          <div>Käsittelemätön virhetilanne: {code}</div>
        )}
      </>
    );
  };

  useEffect(() => {
    const prefetchData = async () => {
      // Only the supervisions app allows offline use, so only prefetch data for those users
      // Use await to prefetch all required data before continuing
      // TODO - maybe add a spinner to indicate loading?
      if (userHasRole("SILLARI_SILLANVALVOJA")) {
        await prefetchOfflineData(queryClient, dispatch);
      }
    };
    prefetchData();
  }, [userHasRole, dispatch]);

  const statusCode = failedStatus.getUserData > 0 ? failedStatus.getUserData : errorCode;

  return (
    <QueryClientProvider client={queryClient}>
      <IonApp>
        {!userData ? (
          <IonContent className="ion-padding">{statusCode >= 400 ? <>{renderError(statusCode)}</> : <div>Starting app...</div>}</IonContent>
        ) : (
          <IonReactRouter>
            <SidebarMenu roles={userData.roles} version={version} />
            <IonContent id="MainContent">
              <Switch>
                <Route exact path="/supervisions">
                  {userHasRole("SILLARI_SILLANVALVOJA") ? <Supervisions /> : <AccessDenied />}
                </Route>
                {/*Optional params not supported in react-router v6, have to declare two routes for both options to work*/}
                <Route exact path="/supervisions/:tabId">
                  {userHasRole("SILLARI_SILLANVALVOJA") ? <Supervisions /> : <AccessDenied />}
                </Route>
                <Route exact path="/bridgemap/:routeBridgeId">
                  {userHasRole("SILLARI_KULJETTAJA") || userHasRole("SILLARI_SILLANVALVOJA") || userHasRole("SILLARI_AJOJARJESTELIJA") ? (
                    <Map />
                  ) : (
                    <AccessDenied />
                  )}
                </Route>
                <Route exact path="/routemap/:routeId">
                  {userHasRole("SILLARI_KULJETTAJA") || userHasRole("SILLARI_SILLANVALVOJA") || userHasRole("SILLARI_AJOJARJESTELIJA") ? (
                    <Map />
                  ) : (
                    <AccessDenied />
                  )}
                </Route>
                <Route exact path="/routeTransportDetail/:routeTransportId">
                  {userHasRole("SILLARI_SILLANVALVOJA") ? <RouteTransportDetail /> : <AccessDenied />}
                </Route>
                <Route exact path="/bridgeDetail/:supervisionId">
                  {userHasRole("SILLARI_SILLANVALVOJA") ? <BridgeDetail /> : <AccessDenied />}
                </Route>
                <Route exact path="/supervision/:supervisionId">
                  {userHasRole("SILLARI_SILLANVALVOJA") ? <Supervision /> : <AccessDenied />}
                </Route>
                <Route exact path="/denyCrossing/:supervisionId">
                  {userHasRole("SILLARI_SILLANVALVOJA") ? <DenyCrossing /> : <AccessDenied />}
                </Route>
                <Route exact path="/summary/:supervisionId">
                  {userHasRole("SILLARI_SILLANVALVOJA") ? <SupervisionSummary /> : <AccessDenied />}
                </Route>
                <Route exact path="/takePhotos/:supervisionId">
                  {userHasRole("SILLARI_SILLANVALVOJA") ? <Photos /> : <AccessDenied />}
                </Route>
                <Route exact path="/management">
                  {userHasRole("SILLARI_AJOJARJESTELIJA") ? <CompanySummary /> : <AccessDenied />}
                </Route>
                <Route exact path="/management/addTransport/:permitId">
                  {userHasRole("SILLARI_AJOJARJESTELIJA") ? <AddTransport /> : <AccessDenied />}
                </Route>
                <Route exact path="/management/transportDetail/:routeTransportId">
                  {userHasRole("SILLARI_AJOJARJESTELIJA") ? <TransportDetail /> : <AccessDenied />}
                </Route>
                <Route exact path="/transport">
                  {userHasRole("SILLARI_KULJETTAJA") ? <TransportCodeInput /> : <AccessDenied />}
                </Route>
                <Route exact path="/transport/:transportPassword">
                  {userHasRole("SILLARI_KULJETTAJA") ? <Transport /> : <AccessDenied />}
                </Route>
                <Route exact path="/settings">
                  <Settings />
                </Route>
                <Route exact path="/userinfo">
                  {userHasRole("SILLARI_KULJETTAJA") || userHasRole("SILLARI_SILLANVALVOJA") || userHasRole("SILLARI_AJOJARJESTELIJA") ? (
                    <UserInfo userData={userData} />
                  ) : (
                    <AccessDenied />
                  )}
                </Route>
                <Route exact path="/">
                  <Redirect to={homePage} />
                </Route>
              </Switch>
            </IonContent>
          </IonReactRouter>
        )}
      </IonApp>
    </QueryClientProvider>
  );
};

export default withTranslation()(App);
