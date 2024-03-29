import React, { useEffect, useState } from "react";
import { useQuery } from "react-query";
import { useDispatch } from "react-redux";
import { useTranslation } from "react-i18next";
import { IonButton, IonCol, IonContent, IonGrid, IonIcon, IonImg, IonRow, IonText } from "@ionic/react";
import { cloudOfflineOutline } from "ionicons/icons";
import moment from "moment";
import IUserData from "../interfaces/IUserData";
import help from "../theme/icons/help.svg";
import vaylaLogo from "../theme/icons/vayla_alla_fi_rgb.png";
import { getUserData } from "../utils/backendData";
import { DATE_TIME_FORMAT_MIN } from "../utils/constants";
import { getCompanyTransportsList } from "../utils/supervisionBackendData";
import OfflineInfoModal from "./OfflineInfoModal";
import "./AppCheck.css";

interface AppCheckProps {
  statusCode: number;
  isInitialisedOffline: boolean;
  setOkToContinue: (okToContinue: boolean) => void;
  setUserData: (userData?: IUserData) => void;
  setHomePage: (homePage: string) => void;
  logoutFromApp: () => void;
}

const AppCheck = ({ statusCode, isInitialisedOffline, setOkToContinue, setUserData, setHomePage, logoutFromApp }: AppCheckProps): JSX.Element => {
  const { t } = useTranslation();
  const dispatch = useDispatch();

  const [isOfflineInfoOpen, setOfflineInfoOpen] = useState<boolean>(false);
  const [isSupervisionAppAllowed, setSupervisionAppAllowed] = useState<boolean>(false);

  // Check the path, since only the supervision app can be used offline
  // Use window.location since the useLocation hook can't be used as this is rendered outside of IonReactRouter
  const { pathname } = window.location;
  const isSupervisionApp = !pathname.includes("/transport") && !pathname.includes("/management");

  // Get the user data from the cache when offline or the backend when online
  const { data: supervisorUser, isLoading: isLoadingUser } = useQuery(["getSupervisor"], () => getUserData(dispatch), {
    // retry: onRetry,
    staleTime: Infinity,
  });

  // Use the same date as OfflineInfoModal.tsx
  const { dataUpdatedAt } = useQuery(["getCompanyTransportsList"], () => getCompanyTransportsList(dispatch), {
    // retry: onRetry,
    staleTime: Infinity,
  });

  useEffect(() => {
    // The react-query client cannot get data from the cache when offline until QueryClientProvider is ready
    // This means that calling queryClient.getQueryData to get the user data doesn't work in the App page useEffect when offline
    // So set the user data on the App page from here instead, regardless of whether it is undefined
    setUserData(supervisorUser);

    // Also set the home page here depending on the user role so that the routing works when offline
    // Only the supervision app can be used offline though
    if (supervisorUser && supervisorUser.roles.length > 0) {
      if (supervisorUser.roles.includes("SILLARI_SILLANVALVOJA")) {
        setHomePage("/supervisions");
        setSupervisionAppAllowed(true);
      } else if (supervisorUser.roles.includes("SILLARI_AJOJARJESTELIJA")) {
        setHomePage("/management");
      } else if (supervisorUser.roles.includes("SILLARI_KULJETTAJA")) {
        setHomePage("/transport");
      }
    }

    if (!isInitialisedOffline && supervisorUser) {
      // The application was initialised online and the user data is available, so continue to show the rest of the UI
      // When offline, the 'use offline' button below will handle this instead
      setOkToContinue(true);
    }
  }, [supervisorUser, isInitialisedOffline, setOkToContinue, setUserData, setHomePage]);

  return (
    <IonContent>
      {/* Loading, online or offline */}
      {((!isInitialisedOffline && !supervisorUser && statusCode < 400) || (isInitialisedOffline && isLoadingUser)) && (
        <IonGrid className="appCheckDetailsGrid ion-padding">
          <IonRow>
            <IonCol>
              <IonText className="headingText">{t("appCheck.startingApp")}</IonText>
            </IonCol>
          </IonRow>
        </IonGrid>
      )}

      {/* Online */}
      {!isInitialisedOffline && !supervisorUser && statusCode >= 400 && (
        <IonGrid className="ion-no-padding">
          <IonRow>
            <IonCol>
              <IonGrid className="appCheckHeaderGrid ion-padding">
                <IonRow>
                  <IonCol className="ion-text-center">
                    <IonImg className="appCheckMainLogo" src={vaylaLogo} alt="Väylävirasto" />
                  </IonCol>
                </IonRow>
                <IonRow>
                  <IonCol className="ion-text-center">
                    <IonText className="appCheckMainTitle">{t("main.title")}</IonText>
                  </IonCol>
                </IonRow>
              </IonGrid>
            </IonCol>
          </IonRow>

          {/* 401 - Returned by Väylä access control. */}
          {!isInitialisedOffline && !supervisorUser && statusCode === 401 && (
            <IonRow>
              <IonCol>
                <IonGrid className="appCheckDetailsGrid ion-padding">
                  <IonRow>
                    <IonCol>
                      <IonText className="headingText">{t("appCheck.accessDenied")}</IonText>
                    </IonCol>
                  </IonRow>
                  <IonRow className="ion-margin-top">
                    <IonCol>
                      <IonText>{t("appCheck.loginToUse")}</IonText>
                    </IonCol>
                  </IonRow>

                  <IonRow className="ion-margin-top">
                    <IonCol>
                      <IonButton color="primary" expand="block" size="large" onClick={logoutFromApp}>
                        {t("appCheck.login")}
                      </IonButton>
                    </IonCol>
                  </IonRow>
                </IonGrid>
              </IonCol>
            </IonRow>
          )}

          {/* 403 - Returned by SillaRi backend if user does not have SillaRi roles. */}
          {!isInitialisedOffline && !supervisorUser && statusCode === 403 && (
            <IonRow>
              <IonCol>
                <IonGrid className="appCheckDetailsGrid ion-padding">
                  <IonRow>
                    <IonCol>
                      <IonText className="headingText">{t("appCheck.accessDenied")}</IonText>
                    </IonCol>
                  </IonRow>
                  <IonRow className="ion-margin-top">
                    <IonCol>
                      <IonText>{t("appCheck.noRights")}</IonText>
                    </IonCol>
                  </IonRow>
                </IonGrid>
              </IonCol>
            </IonRow>
          )}

          {/* Other error */}
          {!isInitialisedOffline && !supervisorUser && statusCode >= 400 && statusCode !== 401 && statusCode !== 403 && (
            <IonRow>
              <IonCol>
                <IonGrid className="appCheckDetailsGrid ion-padding">
                  <IonRow>
                    <IonCol>
                      <IonText className="headingText">{`${t("appCheck.unhandledError")}: `}</IonText>
                      <IonText>{statusCode}</IonText>
                    </IonCol>
                  </IonRow>
                </IonGrid>
              </IonCol>
            </IonRow>
          )}
        </IonGrid>
      )}

      {/* Offline */}
      {isInitialisedOffline && !isLoadingUser && (
        <IonGrid className="ion-no-padding">
          <IonRow>
            <IonCol>
              <IonGrid className="appCheckHeaderGrid ion-padding">
                <IonRow>
                  <IonCol className="ion-text-center">
                    <IonImg className="appCheckMainLogo" src={vaylaLogo} alt="Väylävirasto" />
                  </IonCol>
                </IonRow>
                <IonRow>
                  <IonCol className="ion-text-center">
                    <IonText className="appCheckMainTitle">{t("main.title")}</IonText>
                  </IonCol>
                </IonRow>
                <IonRow>
                  <IonCol className="ion-text-center">
                    <IonIcon className="appCheckNoNetwork appCheckCloudIcon" size="large" icon={cloudOfflineOutline} />
                  </IonCol>
                </IonRow>
                <IonRow>
                  <IonCol className="ion-text-center">
                    <IonText className="appCheckNoNetwork">{t("main.noNetwork")}</IonText>
                  </IonCol>
                </IonRow>
              </IonGrid>
            </IonCol>
          </IonRow>

          {isSupervisionApp && isSupervisionAppAllowed && supervisorUser && dataUpdatedAt > 0 && (
            <IonRow>
              <IonCol>
                <IonGrid className="appCheckDetailsGrid ion-padding">
                  <IonRow className="ion-align-items-center">
                    <IonCol size="auto">
                      <IonText className="headingText">{t("main.offline")}</IonText>
                    </IonCol>
                    <IonCol>
                      <IonButton className="ion-no-padding" size="default" fill="clear" onClick={() => setOfflineInfoOpen(true)}>
                        <IonIcon slot="icon-only" icon={help} />
                      </IonButton>

                      <OfflineInfoModal isOpen={isOfflineInfoOpen} setOpen={setOfflineInfoOpen} />
                    </IonCol>
                  </IonRow>
                  <IonRow>
                    <IonCol>
                      <IonText>{`${t("offlineInfo.info1")} `}</IonText>
                      <IonText className="headingText">{moment(dataUpdatedAt).format(DATE_TIME_FORMAT_MIN)}</IonText>
                      <IonText>.</IonText>
                    </IonCol>
                  </IonRow>

                  <IonRow className="ion-margin-top">
                    <IonCol>
                      <IonButton color="primary" expand="block" size="large" onClick={() => setOkToContinue(true)}>
                        {t("main.useOffline")}
                      </IonButton>
                    </IonCol>
                  </IonRow>
                </IonGrid>
              </IonCol>
            </IonRow>
          )}

          {(!isSupervisionApp || !isSupervisionAppAllowed || !supervisorUser || dataUpdatedAt === 0) && (
            <IonRow>
              <IonCol>
                <IonGrid className="appCheckDetailsGrid ion-padding">
                  <IonRow>
                    <IonCol>
                      <IonText className="headingText">{t("appCheck.noData")}</IonText>
                    </IonCol>
                  </IonRow>
                  <IonRow className="ion-margin-top">
                    <IonCol>
                      <IonText>{t("appCheck.tryAgainLater")}</IonText>
                    </IonCol>
                  </IonRow>
                </IonGrid>
              </IonCol>
            </IonRow>
          )}
        </IonGrid>
      )}
    </IonContent>
  );
};

export default AppCheck;
