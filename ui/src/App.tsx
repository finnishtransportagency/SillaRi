import React, { useEffect, useState } from "react";
import { Redirect, Route, Switch } from "react-router-dom";
import { IonApp, IonButton, IonContent, setupIonicReact } from "@ionic/react";
import { IonReactRouter } from "@ionic/react-router";
import { withTranslation } from "react-i18next";
import { QueryClient, QueryClientProvider } from "react-query";
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
import { getOrigin } from "./utils/request";
import Photos from "./pages/Photos";
import IVersionInfo from "./interfaces/IVersionInfo";
import UserInfo from "./pages/UserInfo";
import * as serviceWorkerRegistration from "./serviceWorkerRegistration";

/* Sillari.css */
import "./theme/sillari.css";

// Use the same style for all platforms
setupIonicReact({
  mode: "md",
});

// NOTE: the react-query client is currently using the default options as described here: https://react-query.tanstack.com/guides/important-defaults
// This means cached data is considered as stale, so data is always refetched, for example during page navigation or when the browser window gets focus
// The queries themselves are stored in the cache based on a query key (using the query parameters), and garbage collected after 5 minutes if not used again
const queryClient = new QueryClient();

const App: React.FC = () => {
  const [userData, setUserData] = useState<IUserData>();
  const [homePage, setHomePage] = useState<string>("/supervisions");
  const [errorCode, setErrorCode] = useState<number>(0);
  const [version, setVersion] = useState<string>("-");

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        /* Disabling caching to avoid getting stale user data. */
        const headers = new Headers();
        headers.append("pragma", "no-cache");
        headers.append("cache-control", "no-store");

        const [userDataResponse, versionResponse] = await Promise.all([
          fetch(`${getOrigin()}/api/ui/userdata`, { method: "GET", headers: headers }),
          fetch(`${getOrigin()}/api/ui/versioninfo`, { method: "GET", headers: headers }),
        ]);

        if (versionResponse?.ok) {
          const responseData = await (versionResponse.json() as Promise<IVersionInfo>);
          setVersion(responseData.version);
        }

        if (userDataResponse?.ok) {
          const responseData = await (userDataResponse.json() as Promise<IUserData>);
          if (responseData.roles.length > 0) {
            if (responseData.roles.includes("SILLARI_SILLANVALVOJA")) {
              setHomePage("/supervisions");
            } else if (responseData.roles.includes("SILLARI_AJOJARJESTELIJA")) {
              setHomePage("/management");
            } else if (responseData.roles.includes("SILLARI_KULJETTAJA")) {
              setHomePage("/transport");
            }
            setUserData(responseData);
          } else {
            /* Should never happen, since backend returns 403, if user does not have SillaRi roles. */
            setErrorCode(1001);
          }
        } else {
          console.log(userDataResponse);
          if (userDataResponse.status === 401) {
            /* Returned by Väylä access control. */
            setErrorCode(401);
          } else if (userDataResponse.status === 403) {
            /* Returned by SillaRi backend if user does not have SillaRi roles. */
            setErrorCode(403);
          } else {
            /* Properly handling other response code not handled yet. */
            setErrorCode(1002);
          }
        }
      } catch (e) {
        console.log(e);
        setErrorCode(1003);
      }
    };
    fetchUserData();
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

  const userHasRole = (role: string) => {
    if (userData) {
      return userData.roles.includes(role);
    }
    return false;
  };

  const renderError = (code: number) => {
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

  return (
    <QueryClientProvider client={queryClient}>
      <IonApp>
        {!userData ? (
          <IonContent className="ion-padding">{errorCode ? <>{renderError(errorCode)}</> : <div>Starting app...</div>}</IonContent>
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
                  {userHasRole("SILLARI_SILLANVALVOJA") || userHasRole("SILLARI_SILLANVALVOJA") || userHasRole("SILLARI_AJOJARJESTELIJA") ? (
                    <Map />
                  ) : (
                    <AccessDenied />
                  )}
                </Route>
                <Route exact path="/routemap/:routeId">
                  {userHasRole("SILLARI_SILLANVALVOJA") || userHasRole("SILLARI_SILLANVALVOJA") || userHasRole("SILLARI_AJOJARJESTELIJA") ? (
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
                  {userHasRole("SILLARI_SILLANVALVOJA") || userHasRole("SILLARI_SILLANVALVOJA") || userHasRole("SILLARI_AJOJARJESTELIJA") ? (
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
