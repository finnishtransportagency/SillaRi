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
            crossings {
                id
                drivingLineInfo
                speedInfo
                exceptionsInfo
                describe
                drivingLineInfoDesc
                speedInfoDesc
                exceptionsInfoDesc
                extraInfoDesc
                bridge {
                    id
                    name
                }
            }
        }
    }
`;

export default routeQuery;
