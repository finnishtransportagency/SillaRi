import { DocumentNode, gql } from "@apollo/client";

export const routeQuery = (id: number): DocumentNode => gql`
    {
        Route(id: ${id}) {
            id
            name
            departureTime
            arrivalTime
            arrivalAddress {
                id
                city
                postalcode
                street
            }
            departureAddress {
                id
                city
                postalcode
                street
            }
            routeBridges {
                id
                bridge {
                    id
                    name
                    identifier
                }
                crossingInstruction
            }
        }
    }
`;

export default routeQuery;
