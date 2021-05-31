import { DocumentNode, gql } from "@apollo/client";

export const routeBridgeQuery = (id: number): DocumentNode => gql`
    {
        RouteBridge(id: ${id}){
            id
            routeId
            bridge {
                id
                name
                identifier
                municipality
                geojson
            }
            crossingInstruction
        }
    }
`;

export default routeBridgeQuery;
