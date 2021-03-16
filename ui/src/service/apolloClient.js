import { ApolloClient, createHttpLink, InMemoryCache, ApolloProvider } from "@apollo/client";

let url;
if (window.location.hostname === "localhost") {
  url = "http://localhost:8080/api/graphql";
} else {
  url = "https://sillaridev.testivaylapilvi.fi/api/graphql";
}

export const link = createHttpLink({
  uri: url,
});

export const client = new ApolloClient({
  cache: new InMemoryCache({ addTypename: false }),
  link,
});

export default client;
