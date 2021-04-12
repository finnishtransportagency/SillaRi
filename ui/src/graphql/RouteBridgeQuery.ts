import { DocumentNode, gql } from "@apollo/client";

export const routeBridgeQuery = (routeId: number, bridgeId: number): DocumentNode => gql`
    {
        RouteBridge(routeId: ${routeId}, bridgeId: ${bridgeId}){
            id
            name
            identifier
            crossingInstruction
        }
    }
`;

export default routeBridgeQuery;
