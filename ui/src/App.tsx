import React, { useEffect, useState } from "react";
import { Redirect, Route, Switch } from "react-router-dom";
import { IonApp, IonButton, IonContent, setupConfig } from "@ionic/react";
import { IonReactRouter } from "@ionic/react-router";
import { withTranslation } from "react-i18next";
import { QueryClient, QueryClientProvider } from "react-query";
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

/* Core CSS required for Ionic components to work properly */
import "@ionic/react/css/core.css";

/* Basic CSS for apps built with Ionic */
import "@ionic/react/css/normalize.css";
import "@ionic/react/css/structure.css";
import "@ionic/react/css/typography.css";

/* Optional CSS utils that can be commented out */
import "@ionic/react/css/padding.css";
import "@ionic/react/css/float-elements.css";
import "@ionic/react/css/text-alignment.css";
import "@ionic/react/css/text-transformation.css";
import "@ionic/react/css/flex-utils.css";
import "@ionic/react/css/display.css";

/* Theme variables */
import "./theme/variables.css";

/* Sillari.css */
import "./theme/sillari.css";
import IUserData from "./interfaces/IUserData";
import { getOrigin } from "./utils/request";
import Photos from "./pages/Photos";

import * as serviceWorkerRegistration from "./serviceWorkerRegistration";
import Cookies from "js-cookie";

// Use the same style for all platforms
setupConfig({
  mode: "md",
});

// NOTE: the react-query client is currently using the default options as described here: https://react-query.tanstack.com/guides/important-defaults
// This means cached data is considered as stale, so data is always refetched, for example during page navigation or when the browser window gets focus
// The queries themselves are stored in the cache based on a query key (using the query parameters), and garbage collected after 5 minutes if not used again
const queryClient = new QueryClient();

const App: React.FC = () => {
  const [userData, setUserData] = useState<IUserData>();
  const [homePage, setHomePage] = useState<string>("/supervisions");
  const [errorMsg, setErrorMsg] = useState<string>();

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const userDataResponse = await fetch(`${getOrigin()}/api/ui/userdata`);

        if (userDataResponse?.ok) {
          const responseData = await userDataResponse.json();
          if (responseData.roles.length > 0) {
            if (responseData.roles.includes("SILLARI_SILLANVALVOJA")) {
              setHomePage("/supervisions");
            } else if (responseData.roles.includes("SILLARI_AJOJARJESTELIJA")) {
              setHomePage("/management/1");
            } else if (responseData.roles.includes("SILLARI_KULJETTAJA")) {
              setHomePage("/transport");
            }
            setUserData(responseData);
          } else {
            setErrorMsg("Ei oikeutta SillaRi-sovelluksen käyttöön.");
          }
        } else {
          console.log(userDataResponse);
          if (userDataResponse.status === 401) {
            setErrorMsg("401 - Access denied.");
          } else {
            setErrorMsg("Käsittelemätön virhetilanne 1.");
          }
        }
      } catch (e) {
        console.log(e);
        setErrorMsg("Käsittelemätön virhetilanne 2.");
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

  return (
    <QueryClientProvider client={queryClient}>
      <IonApp>
        {!userData ? (
          <div>
            {errorMsg ? (
              <div>
                <div>{errorMsg}</div>
                <IonButton color="primary" expand="block" size="large" onClick={logoutFromApp}>
                  Kirjaudu sisään
                </IonButton>
              </div>
            ) : (
              <div>Starting app...</div>
            )}
          </div>
        ) : (
          <IonReactRouter>
            <SidebarMenu roles={userData.roles} />
            <IonContent id="MainContent">
              <Switch>
                <Route path="/supervisions" component={Supervisions} exact />
                {/*Optional params not supported in react-router v6, have to declare two routes for both options to work*/}
                <Route path="/supervisions/:tabId" component={Supervisions} exact />
                <Route path="/bridgemap/:routeBridgeId" component={Map} exact />
                <Route path="/routemap/:routeId" component={Map} exact />
                <Route path="/routeTransportDetail/:routeTransportId" component={RouteTransportDetail} exact />
                <Route path="/bridgeDetail/:supervisionId" component={BridgeDetail} exact />
                <Route path="/supervision/:supervisionId" component={Supervision} exact />
                <Route path="/denyCrossing/:supervisionId" component={DenyCrossing} exact />
                <Route path="/summary/:supervisionId" component={SupervisionSummary} exact />
                <Route path="/takePhotos/:supervisionId" component={Photos} exact />
                <Route path="/management/:companyId" component={CompanySummary} exact />
                <Route path="/management/addTransport/:permitId" component={AddTransport} exact />
                <Route path="/management/transportDetail/:routeTransportId" component={TransportDetail} exact />
                <Route path="/transport" component={TransportCodeInput} exact />
                <Route path="/transport/:routeTransportId" component={Transport} exact />
                <Route path="/settings" component={Settings} exact />
                <Route path="/" exact>
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
