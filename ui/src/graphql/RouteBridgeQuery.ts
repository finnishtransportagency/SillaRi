import { DocumentNode, gql } from "@apollo/client";

export const routeBridgeQuery = (id: number): DocumentNode => gql`
    {
        RouteBridge(id: ${id}){
            id
            bridge {
                id
                name
                identifier
            }
            crossingInstruction
        }
    }
`;

export default routeBridgeQuery;
