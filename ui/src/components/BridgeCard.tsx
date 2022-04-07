import React from "react";
import Moment from "react-moment";
import { IonItem, IonLabel, IonText } from "@ionic/react";
import arrowRight from "../theme/icons/arrow-right.svg";
import { SupervisionStatus, TIME_FORMAT_MIN } from "../utils/constants";
import ISupervision from "../interfaces/ISupervision";
import { useTranslation } from "react-i18next";
import IRouteTransport from "../interfaces/IRouteTransport";
import { useHistory } from "react-router-dom";
import { actions } from "../store/rootSlice";
import { useDispatch } from "react-redux";

interface BridgeCardProps {
  supervision: ISupervision;
  routeTransport?: IRouteTransport;
  supervisionListType: string;
}

const BridgeCard = ({ supervision, routeTransport, supervisionListType }: BridgeCardProps): JSX.Element => {
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const history = useHistory();

  const { id: supervisionId, currentStatus, startedTime, plannedTime, routeBridge } = supervision || {};
  const { status: supervisionStatus } = currentStatus || {};
  const statusPlanned = supervisionStatus === SupervisionStatus.PLANNED;
  const { bridge } = routeBridge || {};
  const { identifier, name, municipality } = bridge || {};
  const { tractorUnit = "" } = routeTransport || {};
  const tractorUnitMissing = `(${t("bridgeCard.tractorUnitMissing")})`;

  const navigateToBridgeDetail = () => {
    dispatch({ type: actions.SET_SUPERVISION_LIST_TYPE, payload: supervisionListType });
    history.push(`/bridgedetail/${supervisionId}`);
  };

  return (
    <IonItem className="itemIcon iconLink quarter-margin-bottom" lines="full" detail detailIcon={arrowRight} onClick={() => navigateToBridgeDetail()}>
      <IonLabel>
        <IonLabel className="headingText">
          <Moment format={TIME_FORMAT_MIN}>{statusPlanned ? plannedTime : startedTime}</Moment>
          {statusPlanned && <IonText>{` (${t("bridgeCard.estimate")})`}</IonText>}
        </IonLabel>
        <IonLabel className="headingText">{name}</IonLabel>
        <IonLabel>
          <small>
            {`${identifier}, ${municipality}`}
            {routeTransport && <IonText>{` | ${t("bridgeCard.tractorUnit")} ${tractorUnit ? tractorUnit : tractorUnitMissing}`}</IonText>}
          </small>
        </IonLabel>
      </IonLabel>
    </IonItem>
  );
};

export default BridgeCard;
