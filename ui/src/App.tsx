import React from "react";
import { Route } from "react-router-dom";
import { IonApp, IonRouterOutlet, setupConfig } from "@ionic/react";
import { IonReactRouter } from "@ionic/react-router";
import { withTranslation } from "react-i18next";
import { QueryClient, QueryClientProvider } from "react-query";
import Home from "./pages/Home";
import Settings from "./pages/Settings";
import Map from "./pages/Map";
import Supervision from "./pages/Supervision";
import Camera from "./pages/Camera";
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

// Use the same style for all platforms
setupConfig({
  mode: "md",
});

// NOTE: the react-query client is currently using the default options as described here: https://react-query.tanstack.com/guides/important-defaults
// This means cached data is considered as stale, so data is always refetched, for example during page navigation or when the browser window gets focus
// The queries themselves are stored in the cache based on a query key (using the query parameters), and garbage collected after 5 minutes if not used again
const queryClient = new QueryClient();

const App: React.FC = () => (
  <QueryClientProvider client={queryClient}>
    <IonApp>
      <IonReactRouter>
        <SidebarMenu />
        <IonRouterOutlet id="MainContent">
          <Route path="/" component={Home} exact />
          <Route path="/settings" component={Settings} exact />
          <Route path="/bridgemap/:routeBridgeId" component={Map} exact />
          <Route path="/routemap/:routeId" component={Map} exact />
          <Route path="/routeTransportDetail/:routeTransportId" component={RouteTransportDetail} exact />
          <Route path="/bridgeDetail/:routeBridgeId" component={BridgeDetail} exact />
          <Route path="/supervision/:supervisionId" component={Supervision} exact />
          <Route path="/denyCrossing/:routeBridgeId" component={DenyCrossing} exact />
          <Route path="/summary/:supervisionId" component={SupervisionSummary} exact />
          <Route path="/takePhotos/:supervisionId" component={Camera} exact />
          <Route path="/management/:companyId" component={CompanySummary} exact />
          <Route path="/management/addTransport/:permitId" component={AddTransport} exact />
          <Route path="/management/transportDetail/:routeTransportId" component={TransportDetail} exact />
          <Route path="/transport" component={TransportCodeInput} exact />
          <Route path="/transport/:routeTransportId" component={Transport} exact />
        </IonRouterOutlet>
      </IonReactRouter>
    </IonApp>
  </QueryClientProvider>
);

export default withTranslation()(App);
