import {
    ApolloClient,
    NormalizedCacheObject,
    ApolloProvider,
    gql,
    useQuery
  } from '@apollo/client';
  import { cache } from './cache';
  import React from 'react';
  import ReactDOM from 'react-dom';
  import Pages from './pages';
  import injectStyles from './styles';
  import Login from './pages/login';
  

/*
import { createPersistedQueryLink } from "apollo-link-persisted-queries";
import { createHttpLink } from "apollo-link-http";
import { ApolloLink } from "apollo-link";
*/
  export const typeDefs = gql`
  extend type Query {
    isLoggedIn: Boolean!
    cartItems: [ID!]!
  }
`;
/*
    const link = ApolloLink.from([
    createPersistedQueryLink({ useGETForHashedQueries: true }),
    createHttpLink({ uri: "http://localhost:4000/graphql" })
  ]);

  */
  // Initialize ApolloClient
  const client: ApolloClient<NormalizedCacheObject> = new ApolloClient({
    cache: cache,
    //link: (link as any),
    uri: 'http://localhost:4000/graphql',
    headers: {
      authorization: localStorage.getItem('token') || '',
    },
    typeDefs,
  });
  
  injectStyles();
  


  const IS_LOGGED_IN = gql`
  query IsUserLoggedIn {
    isLoggedIn @client
  }
`;

function IsLoggedIn() {
  const { data } = useQuery(IS_LOGGED_IN);
  return data.isLoggedIn ? <Pages /> : <Login />;
}
  

  // Pass the ApolloClient instance to the ApolloProvider component
  ReactDOM.render(
    <ApolloProvider client={client}>
      <IsLoggedIn />
    </ApolloProvider>,
    document.getElementById('root')
  );