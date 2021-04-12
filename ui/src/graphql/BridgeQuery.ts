import { DocumentNode, gql } from "@apollo/client";

// TODO not used atm, do we combine it with RouteBridgeQuery?
export const bridgeQuery = (id: number): DocumentNode => gql`
    {
        Bridge(id: ${id}) {
            id
            name
        }
    }
`;

export default bridgeQuery;
