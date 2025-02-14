import { ApolloClient, InMemoryCache, createHttpLink } from "@apollo/client";
import { setContext } from "@apollo/client/link/context";
import encryptDecrypt from "../function/encryptDecrypt";
import { getCookie } from "../function/GetCookie";

const authLink = setContext((_, { headers }) => {
  const encryptedToken = getCookie("accessToken");
  console.log("🚀 ~ authLink ~ encryptedToken:", encryptedToken);

  const token = encryptedToken ? encryptDecrypt.decrypt(encryptedToken) : null;

  console.log("🚀 ~ authLink ~ token:", encryptedToken);

  return {
    headers: {
      ...headers,
      Authorization: encryptedToken ? `Bearer ${encryptedToken}` : "",
    },
  };
});

const httpLink = createHttpLink({
  uri: "http://localhost:3000/graphql",
  credentials: "include",
});

const client = new ApolloClient({
  link: authLink.concat(httpLink),
  cache: new InMemoryCache(),
});

export default client;
