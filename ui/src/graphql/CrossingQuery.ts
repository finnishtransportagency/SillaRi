import { DocumentNode, gql } from "@apollo/client";

export const queryCrossing = (crossingId: number, draft: boolean): DocumentNode => gql`
  {
    Crossing(id: ${crossingId}, draft: ${draft}) {
      describe
      drivingLineInfo
      drivingLineInfoDescription
      exceptionsInfo
      exceptionsInfoDescription
      extraInfoDescription
      id
      routeBridgeId
      speedInfo
      speedInfoDescription
      started
      permanentBendings
      twist
      damage
      bridge {
        id
        name
        identifier
      }
      route {
        id
        name
      }
      permit {
        companyId
        permitNumber
        id
      }
      images {
        id
        objectKey
      }
    }
  }
`;

export default queryCrossing;
