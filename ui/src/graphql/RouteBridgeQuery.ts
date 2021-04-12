import { DocumentNode, gql } from "@apollo/client";

export const routeBridgeQuery = (id: number): DocumentNode => gql`
    {
        RouteBridge(id: ${id}){
            id
            name
            identifier
            crossingInstruction
        }
    }
`;

export default routeBridgeQuery;
