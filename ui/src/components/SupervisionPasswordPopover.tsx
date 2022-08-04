import React, { Dispatch, SetStateAction, useState } from "react";
import { IonButton, IonButtons, IonCol, IonGrid, IonIcon, IonPopover, IonRow, IonText, IonToolbar } from "@ionic/react";
import { useTranslation } from "react-i18next";
import close from "../theme/icons/close.svg";
import TransportCodeInput from "./TransportCodeInput";
import { useDispatch } from "react-redux";
import ISupervision from "../interfaces/ISupervision";
import { checkTransportCode, getRouteTransportOfSupervisor, getSupervision } from "../utils/supervisionBackendData";
import { useQuery, useQueryClient } from "react-query";
import { getUserData, onRetry } from "../utils/backendData";
import { SupervisionListType } from "../utils/constants";
import { savePasswordToStorage } from "../utils/trasportCodeStorageUtil";

interface SupervisionPasswordPopoverProps {
  triggerId: string;
  title: string;
  isOpen: boolean;
  setOpen: Dispatch<SetStateAction<boolean>>;
  routeTransportId: number;
  supervisions: ISupervision[];
  supervisionListType: string;
  openSupervision: () => void;
}

const SupervisionPasswordPopover = ({
  triggerId,
  title,
  isOpen,
  setOpen,
  routeTransportId,
  supervisions,
  supervisionListType,
  openSupervision,
}: SupervisionPasswordPopoverProps): JSX.Element => {
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const queryClient = useQueryClient();

  const [codeInputValue, setCodeInputValue] = useState("");
  const [codeInputSent, setCodeInputSent] = useState<boolean>(false);
  const [errorMessage, setErrorMessage] = useState("");

  const { data: user, isLoading: isLoadingUser } = useQuery(["getSupervisor"], () => getUserData(dispatch), {
    retry: onRetry,
    staleTime: Infinity,
  });

  const { username = "" } = user || {};

  /* UGLY BUG FIX

                          ug
                       b
                      g           bug
                      u        bug
      bugbug          b       g
            bug      bugbug bu
               bug  bugbugbugbugbugbug
  bug   bug   bugbugbugbugbugbugbugbugb
     bug   bug bugbugbugbugbugbugbugbugbu
   bugbugbugbu gbugbugbugbugbugbugbugbugbu
  bugbugbugbug
   bugbugbugbu gbugbugbugbugbugbugbugbugbu
     bug   bug bugbugbugbugbugbugbugbugbu
  bug   bug  gbugbugbugbugbugbugbugbugb
               bug  bugbugbugbugbugbug
            bug      bugbug  bu
      bugbug          b        g
                      u         bug
                      g            bug
                       b
                        ug


  Ionic popover does not close when navigating to another page, despite that setOpen(false) is called
  either before openSupervision or after that (or even inside openSupervision before or after history.push).
  The work around is currently:
  - Check the password when it's submitted and close the popover if it checks out
  - Catch the dismiss event in popover native event
  - If supervision has been unlocked, navigate from the page with openSupervision
  */
  const handleSubmitPassword = async () => {
    if (codeInputValue) {
      const codeInputOk = await checkTransportCode(username, routeTransportId, codeInputValue, dispatch);

      if (codeInputOk) {
        if (supervisionListType === SupervisionListType.TRANSPORT) {
          // Save routeTransportId with password to storage
          await savePasswordToStorage(username, routeTransportId, codeInputValue, SupervisionListType.TRANSPORT);
          console.log("Transport code saved for routeTransportId", routeTransportId);

          // Then prefetch the route transport for offline use
          await queryClient.prefetchQuery(
            ["getRouteTransportOfSupervisor", Number(routeTransportId)],
            () => getRouteTransportOfSupervisor(routeTransportId, username, null, dispatch),
            {
              retry: onRetry,
              staleTime: Infinity,
            }
          );
        }

        // Save each supervisionId with password to storage (process in parallel)
        await Promise.all(
          supervisions.map(async (supervision) => savePasswordToStorage(username, supervision.id, codeInputValue, SupervisionListType.BRIDGE))
        );
        console.log("Transport codes saved for " + supervisions.length + " supervisions");

        // Then prefetch all supervisions for offline use
        await Promise.all(
          supervisions.map((supervision) => {
            const { id: supervisionId } = supervision || {};

            return queryClient.prefetchQuery(
              ["getSupervision", Number(supervisionId)],
              () => getSupervision(supervisionId, username, null, dispatch),
              {
                retry: onRetry,
                staleTime: Infinity,
              }
            );
          })
        );

        setErrorMessage("");
        setCodeInputSent(true);
        // FIXME sometimes popup doesn't always close
        setOpen(false);
      } else {
        setErrorMessage(t("transports.transportCodeInput.invalidCodeErrorMessage"));
      }
    }
  };

  const dismissPopover = () => {
    if (codeInputSent) {
      openSupervision();
    } else {
      setCodeInputValue("");
      setErrorMessage("");
    }
  };

  return (
    /* Bug: Ion Popover renders outside screen when the trigger is too low
      https://github.com/ionic-team/ionic-framework/issues/24870 */
    <IonPopover
      trigger={triggerId}
      isOpen={isOpen}
      className="large-popover"
      size="auto"
      side="top"
      alignment="center"
      onDidDismiss={() => dismissPopover()}
    >
      <>
        <IonToolbar>
          <p className="headingText ion-padding-start">{title}</p>
          <IonButtons slot="end">
            <IonButton onClick={() => setOpen(false)}>
              <IonIcon className="otherIconLarge" icon={close} />
            </IonButton>
          </IonButtons>
        </IonToolbar>
        <IonGrid className="ion-no-padding ion-no-margin ion-margin-bottom" fixed>
          <TransportCodeInput
            codeInputValue={codeInputValue}
            setCodeInputValue={setCodeInputValue}
            errorMessage={errorMessage}
            setErrorMessage={setErrorMessage}
            submitPassword={() => handleSubmitPassword()}
            disabled={!codeInputValue || !routeTransportId || isLoadingUser}
          />
          <IonRow>
            <IonCol className="ion-text-center ion-margin">
              <IonText className="linkText" onClick={() => setOpen(false)}>
                {t("common.buttons.close")}
              </IonText>
            </IonCol>
          </IonRow>
        </IonGrid>
      </>
    </IonPopover>
  );
};

export default SupervisionPasswordPopover;
