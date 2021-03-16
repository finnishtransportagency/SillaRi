import React from "react";
import { Route } from "react-router-dom";
import { IonApp, IonRouterOutlet } from "@ionic/react";
import { IonReactRouter } from "@ionic/react-router";
import { withTranslation } from "react-i18next";
import { ApolloProvider } from "@apollo/client";
import Home from "./pages/Home";
import Settings from "./pages/Settings";
import Map from "./pages/Map";
import Crossing from "./pages/crossing/Crossing";
import CrossingSupervision from "./pages/CrossingSupervision";
import CompaniesList from "./pages/crossing/CompaniesList";
import Camera from "./pages/Camera";
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

const App: React.FC = () => (
  <ApolloProvider client={client}>
    <IonApp>
      <IonReactRouter>
        <SidebarMenu />
        <IonRouterOutlet id="MainContent">
          <Route path="/" component={Home} exact />
          <Route path="/settings" component={Settings} exact />
          <Route path="/map" component={Map} exact />
          <Route path="/camera" component={Camera} exact />
          <Route path="/crossingSupervision" component={CrossingSupervision} exact />
        </IonRouterOutlet>
      </IonReactRouter>
    </IonApp>
  </ApolloProvider>
);

export default withTranslation()(App);
