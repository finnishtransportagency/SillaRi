import React from "react";
import { useTypedSelector } from "../store/store";
import { IonCol, IonGrid, IonRow } from "@ionic/react";
import NoNetworkNoData from "../components/NoNetworkNoData";
import CustomAccordion from "../components/common/CustomAccordion";
import { useTranslation } from "react-i18next";
import { useDispatch } from "react-redux";
import { useQuery } from "react-query";
import { getBridgesOfSupervisor, onRetry } from "../utils/backendData";
import BridgeAccordionHeading from "../components/BridgeAccordionHeading";
import BridgeAccordionPanel from "../components/BridgeAccordionPanel";

const BridgeSupervisions = (): JSX.Element => {
  const { t } = useTranslation();
  const dispatch = useDispatch();

  const {
    selectedSupervisorBridgeList,
    networkStatus: { isFailed = {} },
  } = useTypedSelector((state) => state.crossingsReducer);

  // TODO change static supervisorId to username or something
  useQuery(["getBridgesOfSupervisor", 1], () => getBridgesOfSupervisor(1, dispatch), { retry: onRetry });

  const noNetworkNoData = isFailed.getBridgesOfSupervisor && selectedSupervisorBridgeList === undefined;

  return (
    <div>
      {noNetworkNoData ? (
        <NoNetworkNoData />
      ) : (
        <IonGrid className="ion-no-padding" fixed>
          <IonRow>
            <IonCol className="whiteBackground">
              <IonGrid className="ion-no-padding">
                <IonRow>
                  <IonCol>
                    {selectedSupervisorBridgeList && (
                      <CustomAccordion
                        items={selectedSupervisorBridgeList.map((bridge, index) => {
                          const key = `bridge_${index}`;

                          return {
                            uuid: key,
                            headingColor: "light",
                            heading: <BridgeAccordionHeading bridge={bridge} />,
                            isPanelOpen: index === 0,
                            panel: <BridgeAccordionPanel routeBridges={bridge.routeBridges} />,
                          };
                        })}
                      />
                    )}
                  </IonCol>
                </IonRow>
              </IonGrid>
            </IonCol>
          </IonRow>
        </IonGrid>
      )}
    </div>
  );
};

export default BridgeSupervisions;
