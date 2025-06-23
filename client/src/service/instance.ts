import { ApolloClient, InMemoryCache, createHttpLink } from "@apollo/client";
import { setContext } from "@apollo/client/link/context";
import { getCookie } from "@/function/GetCookie";

const authLink = setContext((_, { headers }) => {
  const encryptedToken = getCookie("accessToken");

  return {
    headers: {
      ...headers,
      Authorization: encryptedToken ? `Bearer ${encryptedToken}` : "",
    },
  };
});

const httpLink = createHttpLink({
  uri: "https://yatra-qqof.onrender.com/graphql",
  credentials: "include",
});

const client = new ApolloClient({
  link: authLink.concat(httpLink),
  cache: new InMemoryCache(),
});

export default client;
