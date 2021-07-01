import React from "react";
import { Route } from "react-router-dom";
import { IonApp, IonRouterOutlet, setupConfig } from "@ionic/react";
import { IonReactRouter } from "@ionic/react-router";
import { withTranslation } from "react-i18next";
import { QueryClient, QueryClientProvider } from "react-query";
import Home from "./pages/Home";
import Settings from "./pages/Settings";
import Map from "./pages/Map";
import Crossing from "./pages/Crossing";
import Camera from "./pages/Camera";
import CompanyDetail from "./pages/CompanyDetail";
import RouteDetail from "./pages/RouteDetail";
import DenyCrossing from "./pages/DenyCrossing";
import BridgeDetail from "./pages/BridgeDetail";
import CrossingSummary from "./pages/CrossingSummary";
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
          <Route path="/map" component={Map} exact />
          <Route path="/bridgemap/:routeBridgeId" component={Map} exact />
          <Route path="/routemap/:routeId" component={Map} exact />
          <Route path="/companydetail/:id" component={CompanyDetail} exact />
          <Route path="/routeDetail/:routeId" component={RouteDetail} exact />
          <Route path="/bridgeDetail/:routeBridgeId" component={BridgeDetail} exact />
          <Route path="/crossing/:routeBridgeId" component={Crossing} exact />
          <Route path="/denyCrossing/:routeBridgeId" component={DenyCrossing} exact />
          <Route path="/takePhotos" component={Camera} exact />
          <Route path="/summary/:crossingId" component={CrossingSummary} exact />
        </IonRouterOutlet>
      </IonReactRouter>
    </IonApp>
  </QueryClientProvider>
);

export default withTranslation()(App);
