import {
  from,
  ApolloClient,
  InMemoryCache,
  ApolloLink,
  NormalizedCacheObject,
} from '@apollo/client';
import { RetryLink } from '@apollo/client/link/retry';
import { onError } from '@apollo/client/link/error';
import { BatchHttpLink } from '@apollo/client/link/batch-http';
import environments from '../utils/environments';

const httpLink: BatchHttpLink = new BatchHttpLink({
  uri: `${environments.apiBaseUrl}/graphql`,
  credentials: 'include',
});

const errorLink: ApolloLink = onError(({ graphQLErrors, networkError }) => {
  if (graphQLErrors)
    graphQLErrors.map(({ message, locations, path }) =>
      console.log(
        `[GraphQL error]: Message: ${message}, Location: ${locations}, Path: ${path}`,
      ),
    );
  if (networkError) console.log(`[Network error]: ${networkError}`);
});

const retryLink: ApolloLink = new RetryLink({
  attempts: (count, operation, error) => {
    return !!error && count < 10;
  },
  delay: (count, operation, error) => {
    return count * 1000 * Math.random();
  },
});

const loggerLink: ApolloLink = new ApolloLink((operation, forward) => {
  operation.setContext({ start: new Date().getTime() });
  if (environments.isDev) {
    console.log(`API ${operation.operationName} started`);
  }

  return forward(operation).map(data => {
    if (environments.isDev) {
      // https://stackoverflow.com/questions/7505623/colors-in-javascript-console
      const time = new Date().getTime() - operation.getContext().start;
      console.log(
        `API ${operation.operationName} completed, took ${time}ms to complete`,
        data,
      );
    }
    return data;
  });
});

export const client: ApolloClient<NormalizedCacheObject> = new ApolloClient({
  cache: new InMemoryCache(),
  link: from([loggerLink, retryLink, errorLink, httpLink]),
});
