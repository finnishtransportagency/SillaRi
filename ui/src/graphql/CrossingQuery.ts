import { DocumentNode, gql } from "@apollo/client";

export const queryCrossing = (crossingId: number): DocumentNode => gql`
  {
    Crossing(id: ${crossingId}) {
      describe
      draft
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
      images {
        id
        objectKey
      }
    }
  }
`;

export default queryCrossing;
