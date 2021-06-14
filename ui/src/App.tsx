import React from "react";
import { Route } from "react-router-dom";
import { IonApp, IonRouterOutlet } from "@ionic/react";
import { IonReactRouter } from "@ionic/react-router";
import { withTranslation } from "react-i18next";
import { ApolloProvider } from "@apollo/client";
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
import apolloClient from "./service/apolloClient";

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

const App: React.FC = () => (
  <ApolloProvider client={apolloClient}>
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
          <Route path="/routeDetail/:permitId/:routeId" component={RouteDetail} exact />
          <Route path="/bridgeDetail/:routeBridgeId" component={BridgeDetail} exact />
          <Route path="/crossing/:routeBridgeId" component={Crossing} exact />
          <Route path="/denyCrossing/:routeBridgeId" component={DenyCrossing} exact />
          <Route path="/takePhotos" component={Camera} exact />
          <Route path="/summary/:crossingId" component={CrossingSummary} exact />
        </IonRouterOutlet>
      </IonReactRouter>
    </IonApp>
  </ApolloProvider>
);

export default withTranslation()(App);
