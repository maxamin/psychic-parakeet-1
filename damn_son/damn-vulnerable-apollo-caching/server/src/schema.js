const { gql } = require('apollo-server');

const typeDefs = gql`
  # Your schema will go here
  type Launch {
  id: ID!
  site: String
  mission: Mission
  rocket: Rocket
  isBooked: Boolean!
}
type Rocket  {
  id: ID!
  name: String
  type: String
}

type User {
  id: ID! @cacheControl(scope: PRIVATE, maxAge: 10)
  email: String! @cacheControl(scope: PRIVATE, maxAge: 20)
  trips: [Launch]! 
  token: String @cacheControl(scope: PRIVATE, maxAge: 0)
}

type Mission  {
  name: String
  missionPatch(size: PatchSize): String
}

enum PatchSize {
  SMALL
  LARGE
}
type Query {
    launches( # replace the current launches query with this one.
    """
    The number of results to show. Must be >= 1. Default = 20
    """
    pageSize: Int
    """
    If you add a cursor here, it will only return results _after_ this cursor
    """
    after: String
  ): LaunchConnection!
  launch(id: ID!): Launch
  me: User
}
type LaunchConnection { # add this below the Query type as an additional type.
  cursor: String!
  hasMore: Boolean!
  launches: [Launch]!
}

type Mutation {
  bookTrips(launchIds: [ID]!): TripUpdateResponse!
  cancelTrip(launchId: ID!): TripUpdateResponse!
  login(email: String, password: String!): User
}
type TripUpdateResponse {
  success: Boolean!
  message: String
  launches: [Launch]
}

`;

module.exports = typeDefs;
