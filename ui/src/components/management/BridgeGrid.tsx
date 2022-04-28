import React, { Dispatch, SetStateAction } from "react";
import { useTranslation } from "react-i18next";
import { IonCol, IonGrid, IonRow, IonText } from "@ionic/react";
import Moment from "react-moment";
import moment from "moment";
import DatePicker from "../common/DatePicker";
import TimePicker from "../common/TimePicker";
import IPermit from "../../interfaces/IPermit";
import IRouteTransport from "../../interfaces/IRouteTransport";
import ISupervision from "../../interfaces/ISupervision";
import ISupervisor from "../../interfaces/ISupervisor";
import { DATE_FORMAT, SupervisionStatus, TIME_FORMAT_MIN } from "../../utils/constants";
import { isPlannedTimeBefore, isTransportEditable } from "../../utils/validation";
import "./BridgeGrid.css";
import SupervisorSelect from "./SupervisorSelect";
import ValidationError from "../common/ValidationError";
import { constructTimesForComparison } from "../../utils/managementUtil";

interface BridgeGridProps {
  supervisors: ISupervisor[];
  permit: IPermit;
  modifiedRouteTransportDetail: IRouteTransport;
  setModifiedRouteTransportDetail: Dispatch<SetStateAction<IRouteTransport | undefined>>;
}

const BridgeGrid = ({ supervisors = [], permit, modifiedRouteTransportDetail, setModifiedRouteTransportDetail }: BridgeGridProps): JSX.Element => {
  const { t } = useTranslation();

  const { supervisions = [] } = modifiedRouteTransportDetail || {};

  const modifySupervisions = (routeBridgeId: number, modifiedSupervision: ISupervision) => {
    // Add the modified supervision for this route bridge id to the supervisions array in place of the existing one
    return supervisions.reduce(
      (acc: ISupervision[], supervision) => {
        return supervision.routeBridgeId === routeBridgeId ? acc : [...acc, supervision];
      },
      [modifiedSupervision]
    );
  };

  const setEstimatedCrossingDate = (supervision: ISupervision, dateTime: Date) => {
    if (modifiedRouteTransportDetail) {
      const dt = supervision.plannedTime;
      dt.setFullYear(dateTime.getFullYear());
      dt.setMonth(dateTime.getMonth());
      dt.setDate(dateTime.getDate());
      const modifiedSupervision: ISupervision = { ...supervision, plannedTime: dt };
      const modifiedSupervisions = modifySupervisions(supervision.routeBridgeId, modifiedSupervision);

      const newDetail: IRouteTransport = { ...modifiedRouteTransportDetail, supervisions: modifiedSupervisions };
      setModifiedRouteTransportDetail(newDetail);
    }
  };

  const setEstimatedCrossingTime = (supervision: ISupervision, dateTime: Date) => {
    if (modifiedRouteTransportDetail) {
      const dt = supervision.plannedTime;
      dt.setHours(dateTime.getHours());
      dt.setMinutes(dateTime.getMinutes());
      dt.setSeconds(0);
      const modifiedSupervision: ISupervision = { ...supervision, plannedTime: dt };
      const modifiedSupervisions = modifySupervisions(supervision.routeBridgeId, modifiedSupervision);

      const newDetail: IRouteTransport = { ...modifiedRouteTransportDetail, supervisions: modifiedSupervisions };
      setModifiedRouteTransportDetail(newDetail);
    }
  };

  const setSupervisor = (priority: number, supervisorUsername: string, supervision?: ISupervision) => {
    if (supervision && modifiedRouteTransportDetail) {
      const supervisor = supervisors.find((s) => s.username === supervisorUsername) as ISupervisor;
      const { supervisors: supervisionSupervisors = [], routeBridgeId } = supervision;

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
        // Sort by routeBridge.ordinal (order of bridges on the route)
        .sort((a, b) => {
          const { ordinal: ordinalA = -1 } = a.routeBridge || {};
          const { ordinal: ordinalB = -1 } = b.routeBridge || {};
          return ordinalA - ordinalB;
        })
        .map((supervision, index, sortedSupervisions) => {
          const { routeBridge } = supervision || {};
          const { id: routeBridgeId, bridge, contractNumber = 0 } = routeBridge || {};
          const { identifier, name } = bridge || {};
          const bridgeName = `${identifier} - ${name}`;

          const { plannedTime, currentStatus, supervisors: supervisionSupervisors = [] } = supervision;
          const { status: supervisionStatus } = currentStatus || {};
          const supervisionStarted =
            supervisionStatus && supervisionStatus !== SupervisionStatus.PLANNED && supervisionStatus !== SupervisionStatus.CANCELLED;
          const statusText = supervisionStarted
            ? t(`management.transportDetail.bridgeInfo.supervisionStatus.${supervisionStatus.toLowerCase()}`)
            : "";

          const estimatedCrossingTime = moment(plannedTime);
          const supervisor1 = supervisionSupervisors.find((s) => s.priority === 1);
          const supervisor2 = supervisionSupervisors.find((s) => s.priority === 2);
          const { firstName: firstName1 = "", lastName: lastName1 = "" } = supervisor1 || {};
          const { firstName: firstName2 = "", lastName: lastName2 = "" } = supervisor2 || {};

          const isEditable = isTransportEditable(modifiedRouteTransportDetail, permit);
          const key = `bridge_${index}`;

          const { plannedDepartureTime } = modifiedRouteTransportDetail || {};
          const previousTimes: Date[] = constructTimesForComparison(plannedDepartureTime, sortedSupervisions, index);
          const hasDateError = isPlannedTimeBefore(plannedTime, previousTimes, "dates");
          const hasTimeError = !hasDateError && isPlannedTimeBefore(plannedTime, previousTimes, "minutes");

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

                  {contractNumber && (
                    <IonRow className="ion-margin-top">
                      <IonCol>
                        <IonText>{`${t("management.transportDetail.bridgeInfo.contractNumber")}: ${contractNumber}`}</IonText>
                      </IonCol>
                    </IonRow>
                  )}
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
                    {isEditable ? (
                      <IonCol>
                        <DatePicker
                          value={estimatedCrossingTime.toDate()}
                          onChange={(value) => setEstimatedCrossingDate(supervision, value)}
                          hasError={hasDateError}
                        />
                        {hasDateError && <ValidationError label={t("common.validation.checkDateShort")} />}
                      </IonCol>
                    ) : (
                      <IonCol size="12">
                        <Moment format={DATE_FORMAT}>{estimatedCrossingTime}</Moment>
                        <IonText> </IonText>
                        <Moment format={TIME_FORMAT_MIN}>{estimatedCrossingTime}</Moment>
                      </IonCol>
                    )}
                    {isEditable && (
                      <IonCol className="ion-margin-start">
                        <TimePicker
                          value={estimatedCrossingTime.toDate()}
                          onChange={(value) => setEstimatedCrossingTime(supervision, value)}
                          hasError={hasTimeError}
                        />
                        {hasTimeError && <ValidationError label={t("common.validation.checkTimeShort")} />}
                      </IonCol>
                    )}
                    {!isEditable && (
                      <>
                        <IonCol className="ion-margin-top">
                          {supervisionStarted && (
                            <IonText className={`ion-text-nowrap supervisionStatus supervisionStatus_${supervisionStatus?.toLowerCase()}`}>
                              {statusText}
                            </IonText>
                          )}
                        </IonCol>
                        {supervisionStatus === SupervisionStatus.REPORT_SIGNED && (
                          <IonCol className="ion-margin-top">
                            <IonText className="linkText">{t("sendingList.report")}</IonText>
                          </IonCol>
                        )}
                      </>
                    )}
                  </IonRow>

                  <IonRow className="ion-margin-top ion-hide-lg-up">
                    <IonCol size="12">
                      <IonText className="headingText">{t("management.transportDetail.bridgeInfo.bridgeSupervisors")}</IonText>
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
                      {isEditable ? (
                        // Added key for SupervisorSelect as a workaround for bug: https://github.com/ionic-team/ionic-framework/issues/20106
                        // which causes infinite loops when supervisors are updated from setAllBridgesSupervisor
                        // (onIonChange event is triggered from supervision changes in state. Key change creates a new instance of the select.)
                        <SupervisorSelect
                          key={`${routeBridgeId}-${supervisor1?.priority}-${supervisor1?.username}`}
                          supervisors={supervisors}
                          supervision={supervision}
                          priority={1}
                          value={supervisor1}
                          setSupervisor={setSupervisor}
                        />
                      ) : (
                        <IonText>{`${firstName1} ${lastName1}`}</IonText>
                      )}
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
                      {isEditable ? (
                        <SupervisorSelect
                          key={`${routeBridgeId}-${supervisor2?.priority}-${supervisor2?.username}`}
                          supervisors={supervisors}
                          supervision={supervision}
                          priority={2}
                          value={supervisor2}
                          setSupervisor={setSupervisor}
                        />
                      ) : (
                        <IonText>{`${firstName2} ${lastName2}`}</IonText>
                      )}
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
