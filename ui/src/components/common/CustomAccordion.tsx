import React, { ReactNode } from "react";
import { IonAccordion, IonAccordionGroup, IonItem } from "@ionic/react";
import arrowOpen from "../../theme/icons/arrow-open.svg";
import "./CustomAccordion.css";

interface CustomAccordionProps {
  className?: string;
  items: {
    uuid: string;
    itemClassName?: string;
    headingColor?: string;
    heading: ReactNode;
    isPanelOpen?: boolean;
    panel: ReactNode;
  }[];
}

const CustomAccordion = ({ className, items }: CustomAccordionProps): JSX.Element => {
  return items.length > 0 ? (
    <IonAccordionGroup
      className={`customAccordion ${className || ""}`}
      multiple={true}
      value={items.filter((item) => item.isPanelOpen ?? false).map((item) => item.uuid)}
    >
      {items.map((item) => {
        const { uuid, itemClassName, headingColor, heading, panel } = item;
        return (
          <IonAccordion className={itemClassName || ""} value={uuid} key={uuid} toggleIcon={arrowOpen}>
            <IonItem slot="header" lines="none" color={headingColor}>
              {heading}
            </IonItem>
            <div slot="content">{panel}</div>
          </IonAccordion>
        );
      })}
    </IonAccordionGroup>
  ) : (
    <></>
  );
};

CustomAccordion.defaultProps = {
  className: undefined,
};

export default CustomAccordion;
