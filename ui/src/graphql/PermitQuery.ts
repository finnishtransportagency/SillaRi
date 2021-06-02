import { DocumentNode, gql } from "@apollo/client";

export const permitQuery = (id: number): DocumentNode => gql`
    {
        Permit(id: ${id}) {
            id
            companyId
            permitNumber
            validStartDate
            validEndDate
            totalMass
            axles {
                id
                axleNumber
                weight
                distanceToNext
                maxDistanceToNext
            }
            transportDimensions{
                id
                permitId
                height
                width
                length
            }
            vehicles {
                id
                permitId
                type
                identifier
            }
            routes {
                id
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
            }
        }
    }
`;

export default permitQuery;
