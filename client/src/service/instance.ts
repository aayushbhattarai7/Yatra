import { ApolloClient, InMemoryCache, createHttpLink } from '@apollo/client';
import { setContext } from '@apollo/client/link/context';
import encryptDecrypt from "../function/encryptDecrypt";

const httpLink = createHttpLink({
  uri: `http://localhost:3000/graphql`,
});

const authLink = setContext((_, { headers }) => {
  const encryptedToken =
    sessionStorage.getItem("accessToken") ||
    localStorage.getItem("accessToken");

  const token = encryptedToken
    ? encryptDecrypt.decrypt(encryptedToken)
    : null;

    console.log("🚀 ~ authLink ~ token:", token)
  return {
    headers: {
      ...headers,
      Authorization: token ? `Bearer ${token}` : "",
    },
  };
});

const client = new ApolloClient({
  link: authLink.concat(httpLink),
  cache: new InMemoryCache(),
});
console.log("🚀 ~ client:", client)

export default client;
