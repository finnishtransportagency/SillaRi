import React, { ReactNode } from "react";
import { Accordion, AccordionItem, AccordionItemButton, AccordionItemHeading, AccordionItemPanel } from "react-accessible-accordion";
import { UUID } from "react-accessible-accordion/dist/types/components/ItemContext";
import { IonIcon, IonItem } from "@ionic/react";
import arrowClose from "../../theme/icons/arrow-close.svg";
import arrowOpen from "../../theme/icons/arrow-open.svg";
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
                <IonItem lines="none" color={headingColor} className="accordionHeaderItem">
                  {heading}
                  <IonIcon className="otherIcon openIcon" icon={arrowOpen} slot="end" />
                  <IonIcon className="otherIcon closeIcon" icon={arrowClose} slot="end" />
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
