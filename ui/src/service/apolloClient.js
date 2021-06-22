import { ApolloClient, createHttpLink, InMemoryCache } from "@apollo/client";

let url;
if (window.location.hostname === "localhost") {
  url = "http://localhost:8080/api/";
} else {
  url = "https://sillaridev.testivaylapilvi.fi/api/";
}

export const link = createHttpLink({
  uri: `${url}graphql/`,
});

const client = new ApolloClient({
  cache: new InMemoryCache({ addTypename: false }),
  link,
});

export const apiUrl = url;

export default client;
