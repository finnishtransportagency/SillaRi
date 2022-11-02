import React, { useState } from "react";
import "./OwnListAddModal.css";
import IRoute from "../../interfaces/IRoute";
import { IonCheckbox, IonItem, IonLabel } from "@ionic/react";

interface SelectBridgeInputProps {
  index: number;
  routes: Array<IRoute>;
  selectedRouteIndex: number | null;
  onChange: (index: number, selectedRouteBridgeIds: Array<number>) => void;
}

const SelectBridgeInput = ({ index, routes, selectedRouteIndex, onChange }: SelectBridgeInputProps): JSX.Element => {
  const [selectedIds, setSelectedIds] = useState<Array<number>>([]);

  const updateSelectedRouteBridges = (selectedId: number, selected: boolean) => {
    if (selected === true) {
      selectedIds.push(selectedId);
      setSelectedIds(selectedIds);
      onChange(index, selectedIds);
    } else {
      const array = selectedIds.filter((id) => {
        return id !== selectedId;
      });

      setSelectedIds(array);
      onChange(index, array);
    }
  };

  const route = selectedRouteIndex === null ? null : routes[selectedRouteIndex];

  return (
    <>
      {route !== null && (
        <>
          {route.routeBridges.map((routeBridge, i) => (
            <IonItem key={"bridge_" + i}>
              <IonCheckbox
                value={routeBridge.id}
                slot="start"
                onIonChange={(event) => {
                  updateSelectedRouteBridges(event.target.value, event.detail.checked);
                }}
              />
              <IonLabel>
                {routeBridge.bridge.identifier} {routeBridge.bridge.name}
              </IonLabel>
            </IonItem>
          ))}
        </>
      )}
    </>
  );
};

export default SelectBridgeInput;
