import React, { ReactNode } from "react";
import { Accordion, AccordionItem, AccordionItemButton, AccordionItemHeading, AccordionItemPanel } from "react-accessible-accordion";
import { UUID } from "react-accessible-accordion/dist/types/components/ItemContext";
import { IonIcon, IonItem } from "@ionic/react";
import { chevronDown, chevronUp } from "ionicons/icons";
import "./CustomAccordion.css";

interface CustomAccordionProps {
  className?: string;
  items: {
    uuid: string;
    headingColor?: string;
    heading: ReactNode;
    isPanelOpen?: boolean;
    panel: ReactNode;
  }[];
}

const CustomAccordion = ({ className, items }: CustomAccordionProps): JSX.Element => {
  return items.length > 0 ? (
    <Accordion
      className={`customAccordion ${className || ""}`}
      allowMultipleExpanded
      allowZeroExpanded
      preExpanded={items.filter((item) => item.isPanelOpen ?? false).map((item) => item.uuid as UUID)}
    >
      {items.map((item) => {
        const { uuid, headingColor, heading, panel } = item;
        return (
          <AccordionItem key={uuid} uuid={uuid}>
            <AccordionItemHeading>
              <AccordionItemButton>
                <IonItem lines="none" color={headingColor}>
                  {heading}
                  <IonIcon className="openIcon" icon={chevronDown} slot="end" />
                  <IonIcon className="closeIcon" icon={chevronUp} slot="end" />
                </IonItem>
              </AccordionItemButton>
            </AccordionItemHeading>
            <AccordionItemPanel>{panel}</AccordionItemPanel>
          </AccordionItem>
        );
      })}
    </Accordion>
  ) : (
    <></>
  );
};

CustomAccordion.defaultProps = {
  className: undefined,
};

export default CustomAccordion;
