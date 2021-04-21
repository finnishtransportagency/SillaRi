import { DocumentNode, gql } from "@apollo/client";

export const transportQuery = (id: number): DocumentNode => gql`
  {
    Transport(id: ${id}) {
      id
      permitId
      routeId
      name
      height
      width
      length
      totalMass
      registrations {
        id
        transportId
        registrationNumber
      }
      axles {
        id
        transportId
        axleNumber
        weight
        distanceToNext
        maxDistanceToNext
      }
    }
  }
`;

export const transportOfRouteQuery = (permitId: number, routeId: number): DocumentNode => gql`
  {
    TransportOfRoute(permitId: ${permitId}, routeId: ${routeId}) {
      id
      permitId
      routeId
      name
      height
      width
      length
      totalMass
      registrations {
        id
        transportId
        registrationNumber
      }
      axles {
        id
        transportId
        axleNumber
        weight
        distanceToNext
        maxDistanceToNext
      }
    }
  }
`;
