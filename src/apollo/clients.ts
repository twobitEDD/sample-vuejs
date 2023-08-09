import { ApolloClient } from 'apollo-client'
import { InMemoryCache } from 'apollo-cache-inmemory'
import { HttpLink } from 'apollo-link-http'
import { SubgraphUri } from '@/constants'

export const client = new ApolloClient({
  link: new HttpLink({
    uri: SubgraphUri,
  }),
  cache: new InMemoryCache(),
})