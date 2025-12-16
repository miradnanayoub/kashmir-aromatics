import { ApolloClient, InMemoryCache, HttpLink } from "@apollo/client";

export const client = new ApolloClient({
  // We use HttpLink to explicitly tell Apollo how to fetch data
  link: new HttpLink({
    uri: "https://kashmiraromatics.in/graphql",
    // Optional: Use 'no-store' to ensure you always get fresh data during development
    fetchOptions: { cache: "no-store" }, 
  }),
  cache: new InMemoryCache(),
});