import { ApolloClient, HttpLink, InMemoryCache, createHttpLink } from '@apollo/client';
import { setContext } from '@apollo/client/link/context';
import encryptDecrypt from "../function/encryptDecrypt";

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
  link: new HttpLink({
    uri: 'http://localhost:3000/graphql', 
    headers: {
      'Content-Type': 'application/json',
    },
  }),
  cache: new InMemoryCache(),
});



export default client;
