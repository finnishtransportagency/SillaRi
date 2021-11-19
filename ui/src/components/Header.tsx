import React, { useState } from "react";
import { useHistory, useLocation } from "react-router-dom";
import { useIsFetching, useIsMutating, useQuery } from "react-query";
import { useDispatch } from "react-redux";
import { IonBadge, IonButton, IonHeader, IonIcon, IonToolbar, IonButtons, IonMenuButton, IonTitle } from "@ionic/react";
import { arrowBackOutline, cloudDownloadOutline, cloudOfflineOutline, cloudOutline, cloudUploadOutline } from "ionicons/icons";
import outgoing from "../theme/icons/outgoing_white_no_badge.svg";
import { getSupervisionSendingList, onRetry } from "../utils/supervisionBackendData";
import SendingList from "./SendingList";

interface HeaderProps {
  title: string;
  somethingFailed?: boolean;
  includeSendingList?: boolean;
  confirmGoBack?: () => void;
}

const Header = ({ title, somethingFailed, includeSendingList, confirmGoBack }: HeaderProps): JSX.Element => {
  const history = useHistory();
  const { pathname } = useLocation();
  const isFetching = useIsFetching();
  const isMutating = useIsMutating();
  const dispatch = useDispatch();

  const { data: supervisionList = [] } = useQuery(["getSupervisionSendingList"], () => getSupervisionSendingList(dispatch), {
    retry: onRetry,
    enabled: includeSendingList,
  });

  const canGoBack = pathname !== "/supervision" && pathname !== "/transport" && pathname !== "/management/1";

  const goBack: () => void = confirmGoBack !== undefined ? confirmGoBack : history.goBack;

  const [isSendingListOpen, setSendingListOpen] = useState<boolean>(false);

  return (
    <IonHeader>
      <IonToolbar color="primary">
        <IonButtons slot="start">
          <IonMenuButton className={canGoBack ? "ion-hide" : ""} />
          <IonButton shape="round" className={canGoBack ? "" : "ion-hide"} onClick={() => goBack()}>
            <IonIcon slot="icon-only" icon={arrowBackOutline} />
          </IonButton>
        </IonButtons>
        <IonTitle className="headingBoldText">{title}</IonTitle>
        <IonButtons slot="end">
          <IonIcon slot="icon-only" icon={cloudOfflineOutline} className={somethingFailed ? "" : "ion-hide"} />
          <IonIcon slot="icon-only" icon={cloudUploadOutline} className={isMutating > 0 && !somethingFailed ? "" : "ion-hide"} />
          <IonIcon
            slot="icon-only"
            icon={cloudDownloadOutline}
            className={isFetching > 0 && isMutating === 0 && !somethingFailed ? "" : "ion-hide"}
          />
          <IonIcon slot="icon-only" icon={cloudOutline} className={isFetching === 0 && isMutating === 0 && !somethingFailed ? "" : "ion-hide"} />

          {includeSendingList && (
            <IonButton shape="round" className="otherIcon" onClick={() => setSendingListOpen(true)}>
              <IonBadge className="iconBadge" color="secondary">
                {supervisionList.length}
              </IonBadge>
              <IonIcon slot="icon-only" icon={outgoing}></IonIcon>
            </IonButton>
          )}
        </IonButtons>

        {includeSendingList && isSendingListOpen && (
          <SendingList isOpen={isSendingListOpen} setOpen={setSendingListOpen} supervisionList={supervisionList} />
        )}
      </IonToolbar>
    </IonHeader>
  );
};

Header.defaultProps = {
  somethingFailed: false,
  includeSendingList: false,
};

export default Header;
