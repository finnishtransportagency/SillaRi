import { DocumentNode, gql } from "@apollo/client";

export const bridgeQuery = (id: number): DocumentNode => gql`
    {
        Bridge(id: ${id}) {
            id
            name
        }
    }
`;

export default bridgeQuery;
