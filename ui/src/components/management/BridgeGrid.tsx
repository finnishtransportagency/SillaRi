import React, { Dispatch, SetStateAction } from "react";
import { useTranslation } from "react-i18next";
import { IonCol, IonGrid, IonItem, IonLabel, IonRadio, IonRadioGroup, IonRow, IonText } from "@ionic/react";
import Moment from "react-moment";
import moment from "moment";
import DatePicker from "../common/DatePicker";
import TimePicker from "../common/TimePicker";
import IRoute from "../../interfaces/IRoute";
import IRouteTransport from "../../interfaces/IRouteTransport";
import ISupervision from "../../interfaces/ISupervision";
import ISupervisor from "../../interfaces/ISupervisor";
import { DATE_FORMAT, SupervisorType, TIME_FORMAT_MIN, TransportStatus } from "../../utils/constants";
import "./BridgeGrid.css";
import SupervisorSelect from "./SupervisorSelect";

interface BridgeGridProps {
  supervisors: ISupervisor[];
  modifiedRouteTransportDetail: IRouteTransport;
  setModifiedRouteTransportDetail: Dispatch<SetStateAction<IRouteTransport | undefined>>;
  selectedRouteOption: IRoute;
}

const BridgeGrid = ({
  supervisors = [],
  modifiedRouteTransportDetail,
  setModifiedRouteTransportDetail,
  selectedRouteOption,
}: BridgeGridProps): JSX.Element => {
  const { t } = useTranslation();

  const { supervisions = [], currentStatus } = modifiedRouteTransportDetail || {};
  const { status } = currentStatus || {};
  const { routeBridges = [] } = selectedRouteOption || {};

  const modifySupervisions = (routeBridgeId: number, modifiedSupervision: ISupervision) => {
    // Add the modified supervision for this route bridge id to the supervisions array in place of the existing one
    return supervisions.reduce(
      (acc: ISupervision[], supervision) => {
        return supervision.routeBridgeId === routeBridgeId ? acc : [...acc, supervision];
      },
      [modifiedSupervision]
    );
  };

  const setEstimatedCrossingTime = (supervision: ISupervision, dateTime: Date) => {
    if (modifiedRouteTransportDetail) {
      const modifiedSupervision: ISupervision = { ...supervision, plannedTime: dateTime };
      const modifiedSupervisions = modifySupervisions(supervision.routeBridgeId, modifiedSupervision);

      const newDetail: IRouteTransport = { ...modifiedRouteTransportDetail, supervisions: modifiedSupervisions };
      setModifiedRouteTransportDetail(newDetail);
    }
  };

  const setSupervisorType = (supervision: ISupervision, supervisorType: SupervisorType) => {
    if (modifiedRouteTransportDetail) {
      const modifiedSupervision: ISupervision = { ...supervision, supervisorType };
      const modifiedSupervisions = modifySupervisions(supervision.routeBridgeId, modifiedSupervision);

      const newDetail: IRouteTransport = { ...modifiedRouteTransportDetail, supervisions: modifiedSupervisions };
      setModifiedRouteTransportDetail(newDetail);
    }
  };

  const setSupervisor = (priority: number, supervisorId: number, supervision?: ISupervision) => {
    if (supervision && modifiedRouteTransportDetail) {
      const supervisor = supervisors.find((s) => s.id === supervisorId) as ISupervisor;
      const { supervisors: supervisionSupervisors = [], routeBridgeId } = supervision;
      console.log("routeBridgeId", routeBridgeId, "supervisor", supervisor);

      // Add the selected supervisor for this route bridge id and priority to the supervisors array in place of the existing one if one exists
      const modifiedSupervisionSupervisors = supervisionSupervisors.reduce(
        (acc, supervisionSupervisor) => {
          return supervisionSupervisor.priority === priority ? acc : [...acc, supervisionSupervisor];
        },
        [{ ...supervisor, priority }]
      );

      const modifiedSupervision: ISupervision = { ...supervision, supervisors: modifiedSupervisionSupervisors };
      const modifiedSupervisions = modifySupervisions(routeBridgeId, modifiedSupervision);

      const newDetail: IRouteTransport = { ...modifiedRouteTransportDetail, supervisions: modifiedSupervisions };
      setModifiedRouteTransportDetail(newDetail);
    }
  };

  // TODO - check bridge list sort order
  return (
    <IonGrid className="bridgeGrid ion-no-padding">
      <IonRow className="lightBackground ion-hide-lg-down">
        <IonCol size="12" size-lg="4" className="ion-padding">
          <IonText>{t("management.transportDetail.bridgeInfo.bridge").toUpperCase()}</IonText>
        </IonCol>
        <IonCol size="12" size-lg="4" className="ion-padding">
          <IonText>{t("management.transportDetail.bridgeInfo.estimatedCrossingTime").toUpperCase()}</IonText>
        </IonCol>
        <IonCol size="12" size-lg="4" className="ion-padding">
          <IonText>{t("management.transportDetail.bridgeInfo.bridgeSupervisor").toUpperCase()}</IonText>
        </IonCol>
      </IonRow>

      {[...supervisions]
        .sort((a, b) => a.routeBridgeId - b.routeBridgeId)
        .map((supervision, index) => {
          const routeBridge = routeBridges.find((rb) => rb.id === supervision.routeBridgeId);
          const { id: routeBridgeId, bridge } = routeBridge || {};
          const { identifier, name } = bridge || {};
          const bridgeName = `${identifier} - ${name}`;

          const { plannedTime, supervisorType, supervisors: supervisionSupervisors = [] } = supervision;
          const estimatedCrossingTime = moment(plannedTime);
          const supervisor1 = supervisionSupervisors.find((s) => s.priority === 1);
          const supervisor2 = supervisionSupervisors.find((s) => s.priority === 2);
          const { firstName: firstName1 = "", lastName: lastName1 = "" } = supervisor1 || {};
          const { firstName: firstName2 = "", lastName: lastName2 = "" } = supervisor2 || {};
          const key = `bridge_${index}`;

          return (
            <IonRow key={key}>
              <IonCol size="12" size-lg="4" className="ion-padding">
                <IonGrid className="ion-no-padding">
                  <IonRow>
                    <IonCol>
                      <IonText className="ion-hide-lg-down">{bridgeName}</IonText>
                      <IonText className="headingText ion-hide-lg-up">{bridgeName}</IonText>
                    </IonCol>
                  </IonRow>
                </IonGrid>
              </IonCol>

              <IonCol size="12" size-lg="4" className="ion-padding">
                <IonGrid className="ion-no-padding">
                  <IonRow>
                    <IonCol size="12" className="ion-hide-lg-up">
                      <IonText className="headingText">{t("management.transportDetail.bridgeInfo.estimatedCrossingTime")}</IonText>
                    </IonCol>
                  </IonRow>
                  <IonRow>
                    <IonCol>
                      {status === TransportStatus.PLANNED && (
                        <DatePicker value={estimatedCrossingTime.toDate()} onChange={(value) => setEstimatedCrossingTime(supervision, value)} />
                      )}
                      {status !== TransportStatus.PLANNED && <Moment format={DATE_FORMAT}>{estimatedCrossingTime}</Moment>}
                    </IonCol>
                    <IonCol>
                      {status === TransportStatus.PLANNED && (
                        <TimePicker value={estimatedCrossingTime.toDate()} onChange={(value) => setEstimatedCrossingTime(supervision, value)} />
                      )}
                      {status !== TransportStatus.PLANNED && <Moment format={TIME_FORMAT_MIN}>{estimatedCrossingTime}</Moment>}
                    </IonCol>
                  </IonRow>

                  <IonRow className="ion-margin-top">
                    <IonCol size="12" className="ion-hide-lg-up">
                      <IonText className="headingText">{t("management.transportDetail.bridgeInfo.bridgeSupervisors")}</IonText>
                    </IonCol>
                  </IonRow>
                  <IonRow>
                    <IonCol size="12">
                      {status === TransportStatus.PLANNED && (
                        <IonRadioGroup
                          name="supervisorType"
                          value={supervisorType}
                          onIonChange={(e) => setSupervisorType(supervision, e.detail.value)}
                        >
                          <IonItem lines="none">
                            <IonRadio slot="start" value={SupervisorType.OWN_SUPERVISOR} />
                            <IonLabel>{t("management.transportDetail.bridgeInfo.ownSupervisor")}</IonLabel>
                          </IonItem>
                          <IonItem lines="none">
                            <IonRadio slot="start" value={SupervisorType.AREA_CONTRACTOR} />
                            <IonLabel>{t("management.transportDetail.bridgeInfo.contractor")}</IonLabel>
                          </IonItem>
                        </IonRadioGroup>
                      )}
                      {status !== TransportStatus.PLANNED && (
                        <IonText>
                          {supervisorType === SupervisorType.OWN_SUPERVISOR && t("management.transportDetail.bridgeInfo.ownSupervisor")}
                          {supervisorType === SupervisorType.AREA_CONTRACTOR && t("management.transportDetail.bridgeInfo.contractor")}
                        </IonText>
                      )}
                    </IonCol>
                  </IonRow>
                </IonGrid>
              </IonCol>

              <IonCol size="12" size-lg="4" className="ion-padding">
                <IonGrid className="ion-no-padding">
                  <IonRow>
                    <IonCol size="12" className="ion-hide-lg-up">
                      <IonText className="headingText">{t("management.transportDetail.bridgeInfo.supervisor1")}</IonText>
                    </IonCol>
                  </IonRow>
                  <IonRow className="ion-align-items-center">
                    <IonCol size="1" className="ion-hide-lg-down">
                      <IonText>1.</IonText>
                    </IonCol>
                    <IonCol>
                      {status === TransportStatus.PLANNED && (
                        // Added key for SupervisorSelect as a workaround for bug: https://github.com/ionic-team/ionic-framework/issues/20106
                        // which causes infinite loops when supervisors are updated from setAllBridgesSupervisor
                        // (onIonChange event is triggered from supervision changes in state. Key change creates a new instance of the select.)
                        <SupervisorSelect
                          key={`${routeBridgeId}-${supervisor1?.priority}-${supervisor1?.id}`}
                          supervisors={supervisors}
                          supervision={supervision}
                          priority={1}
                          value={supervisor1}
                          setSupervisor={setSupervisor}
                        />
                      )}
                      {status !== TransportStatus.PLANNED && <IonText>{`${firstName1} ${lastName1}`}</IonText>}
                    </IonCol>
                  </IonRow>

                  <IonRow className="ion-margin-top">
                    <IonCol size="12" className="ion-hide-lg-up">
                      <IonText className="headingText">{t("management.transportDetail.bridgeInfo.supervisor2")}</IonText>
                    </IonCol>
                  </IonRow>
                  <IonRow className="ion-align-items-center">
                    <IonCol size="1" className="ion-hide-lg-down">
                      <IonText>2.</IonText>
                    </IonCol>
                    <IonCol>
                      {status === TransportStatus.PLANNED && (
                        <SupervisorSelect
                          key={`${routeBridgeId}-${supervisor2?.priority}-${supervisor2?.id}`}
                          supervisors={supervisors}
                          supervision={supervision}
                          priority={2}
                          value={supervisor2}
                          setSupervisor={setSupervisor}
                        />
                      )}
                      {status !== TransportStatus.PLANNED && <IonText>{`${firstName2} ${lastName2}`}</IonText>}
                    </IonCol>
                  </IonRow>
                </IonGrid>
              </IonCol>
            </IonRow>
          );
        })}
    </IonGrid>
  );
};

export default BridgeGrid;
