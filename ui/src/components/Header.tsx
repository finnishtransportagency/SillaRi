import React from "react";
import { IonBackButton, IonHeader, IonToolbar, IonButtons, IonMenuButton, IonTitle } from "@ionic/react";
import "./Header.css";

const Header: React.FC<{ title: string }> = ({ title }: { title: string }) => {
  // Note: the back button visibility is handled by Ionic, but the menu button visibility is handled in Header.css
  return (
    <IonHeader>
      <IonToolbar color="primary">
        <IonButtons slot="start">
          <IonMenuButton />
          <IonBackButton />
        </IonButtons>
        <IonTitle>{title}</IonTitle>
      </IonToolbar>
    </IonHeader>
  );
};

export default Header;
