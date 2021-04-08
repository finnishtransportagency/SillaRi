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
import SidebarMenu from "./components/SidebarMenu";
import client from "./service/apolloClient";

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
import RouteDetail from "./pages/RouteDetail";
import BridgeDetail from "./pages/BridgeDetail";
import CrossingSummary from "./pages/CrossingSummary";
import DenyCrossing from "./pages/DenyCrossing";

/* Sillari.css */
import "./theme/sillari.css";

const App: React.FC = () => (
  <ApolloProvider client={client}>
    <IonApp>
      <IonReactRouter>
        <SidebarMenu />
        <IonRouterOutlet id="MainContent">
          <Route path="/" component={Home} exact />
          <Route path="/settings" component={Settings} exact />
          <Route path="/map" component={Map} exact />
          <Route path="/companydetail/:id" component={CompanyDetail} exact />
          <Route path="/routeDetail/:authorizationId/:routeId" component={RouteDetail} exact />
          <Route path="/bridgeDetail/:id" component={BridgeDetail} exact />
          <Route path="/denyCrossing/:id" component={DenyCrossing} exact />
          <Route path="/supervision/:routeId/:bridgeId" component={Crossing} exact />
          <Route path="/takePhotos" component={Camera} exact />
          <Route path="/summary/:crossingId" component={CrossingSummary} exact />
        </IonRouterOutlet>
      </IonReactRouter>
    </IonApp>
  </ApolloProvider>
);

export default withTranslation()(App);
