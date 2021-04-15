import { DocumentNode, gql } from "@apollo/client";

export const queryRouteBridgeCrossing = (routeBridgeId: number): DocumentNode => gql`
  {
    RouteBridgeCrossing(routeBridgeId: ${routeBridgeId}) {
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

export default queryRouteBridgeCrossing;
