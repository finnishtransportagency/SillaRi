import React from "react";
import { useTranslation } from "react-i18next";
import { IonText } from "@ionic/react";

const Loading = (): JSX.Element => {
  const { t } = useTranslation();

  return (
    <div className="ion-padding ion-text-center">
      <IonText>{t("main.loading")}</IonText>
    </div>
  );
};

export default Loading;
