import { ApolloClient, createHttpLink, InMemoryCache, ApolloProvider } from "@apollo/client";

export const link = createHttpLink({
  uri: "http://127.0.0.1:8080/api/graphql",
});

export const client = new ApolloClient({
  cache: new InMemoryCache({ addTypename: false }),
  link,
});

export default client;
