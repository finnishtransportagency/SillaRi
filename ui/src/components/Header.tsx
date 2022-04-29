import React, { useEffect, useState } from "react";
import { useHistory, useLocation } from "react-router-dom";
import { onlineManager, useIsFetching, useIsMutating, useQuery } from "react-query";
import { useDispatch } from "react-redux";
import { IonBadge, IonButton, IonButtons, IonHeader, IonIcon, IonMenuButton, IonText, IonTitle, IonToolbar } from "@ionic/react";
import { arrowBackOutline, cloudDownloadOutline, cloudOfflineOutline, cloudOutline, cloudUploadOutline, rainyOutline } from "ionicons/icons";
import outgoing from "../theme/icons/outgoing_white_no_badge.svg";
import { onRetry } from "../utils/backendData";
import { getSupervisionSendingList } from "../utils/supervisionBackendData";
import SendingList from "./SendingList";
import OfflineBanner from "./OfflineBanner";
import "./Header.css";
import { isSupervisionSigned } from "../utils/supervisionUtil";
import ISupervision from "../interfaces/ISupervision";

interface HeaderProps {
  title: string;
  secondaryTitle?: string;
  titleStyle?: string;
  somethingFailed?: boolean;
  includeSendingList?: boolean;
  includeOfflineBanner?: boolean;
  confirmGoBack?: () => void;
}

const Header = ({
  title,
  secondaryTitle,
  titleStyle,
  somethingFailed,
  includeSendingList,
  includeOfflineBanner,
  confirmGoBack,
}: HeaderProps): JSX.Element => {
  const history = useHistory();
  const { pathname } = useLocation();
  const isFetching = useIsFetching();
  const isMutating = useIsMutating();
  const dispatch = useDispatch();

  const { data: supervisionList = [] } = useQuery(["getSupervisionSendingList"], () => getSupervisionSendingList(dispatch), {
    retry: onRetry,
    staleTime: Infinity,
    enabled: includeSendingList,
  });

  const canGoBack = !pathname.includes("/supervisions") && pathname !== "/transport" && pathname !== "/management";

  const goBack: () => void = confirmGoBack !== undefined ? confirmGoBack : history.goBack;

  const [isSendingListOpen, setSendingListOpen] = useState<boolean>(false);
  const [isOnline, setOnline] = useState<boolean>(onlineManager.isOnline());

  useEffect(() => {
    onlineManager.subscribe(() => setOnline(onlineManager.isOnline()));
  }, []);

  const [sentSupervisions, setSentSupervisions] = useState<ISupervision[]>([]);
  const [unsentSupervisions, setUnsentSupervisions] = useState<ISupervision[]>([]);

  useEffect(() => {
    // Separate sent and unsent supervisions with useEffect instead of useQuery, since onSuccess is not called when using cached data
    if (supervisionList && supervisionList.length > 0) {
      const sent = supervisionList.filter((supervision) => {
        const { statusHistory = [] } = supervision || {};
        return isSupervisionSigned(statusHistory);
      });
      setSentSupervisions(sent);

      const unsent = supervisionList.filter((supervision) => {
        const { statusHistory = [] } = supervision || {};
        return !isSupervisionSigned(statusHistory);
      });
      setUnsentSupervisions(unsent);
    }
  }, [supervisionList]);

  return (
    <IonHeader>
      <IonToolbar color="primary">
        <IonButtons slot="start">
          <IonMenuButton className={canGoBack ? "ion-hide" : ""} />
          <IonButton shape="round" className={canGoBack ? "" : "ion-hide"} onClick={() => goBack()}>
            <IonIcon slot="icon-only" icon={arrowBackOutline} />
          </IonButton>
        </IonButtons>
        <IonTitle className={titleStyle}>{title}</IonTitle>
        {secondaryTitle && (
          <IonText slot="end" className={`${titleStyle} ion-margin-end`}>
            {secondaryTitle}
          </IonText>
        )}
        <IonButtons slot="end">
          <IonIcon slot="icon-only" icon={rainyOutline} className={`cloudIcon ${somethingFailed ? "" : "ion-hide"}`} />
          <IonIcon slot="icon-only" icon={cloudOfflineOutline} className={`cloudIcon ${!somethingFailed && !isOnline ? "" : "ion-hide"}`} />
          <IonIcon
            slot="icon-only"
            icon={cloudUploadOutline}
            className={`cloudIcon ${isMutating > 0 && !somethingFailed && isOnline ? "" : "ion-hide"}`}
          />
          <IonIcon
            slot="icon-only"
            icon={cloudDownloadOutline}
            className={`cloudIcon ${isFetching > 0 && isMutating === 0 && !somethingFailed && isOnline ? "" : "ion-hide"}`}
          />
          <IonIcon
            slot="icon-only"
            icon={cloudOutline}
            className={`cloudIcon ${isFetching === 0 && isMutating === 0 && !somethingFailed && isOnline ? "" : "ion-hide"}`}
          />

          {includeSendingList && (
            <IonButton shape="round" className="otherIcon" onClick={() => setSendingListOpen(true)}>
              <IonBadge className="iconBadge" color="secondary">
                {unsentSupervisions.length}
              </IonBadge>
              <IonIcon slot="icon-only" icon={outgoing} />
            </IonButton>
          )}
        </IonButtons>

        {includeSendingList && (
          <SendingList
            isOpen={isSendingListOpen}
            setOpen={setSendingListOpen}
            sentSupervisions={sentSupervisions}
            unsentSupervisions={unsentSupervisions}
          />
        )}
      </IonToolbar>

      {includeOfflineBanner && <OfflineBanner />}
    </IonHeader>
  );
};

Header.defaultProps = {
  secondaryTitle: undefined,
  titleStyle: "headingText",
  somethingFailed: false,
  includeSendingList: false,
  includeOfflineBanner: false,
};

export default Header;
