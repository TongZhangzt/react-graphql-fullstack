const express = require('express');
const cors = require('cors');
const { ApolloServer } = require('apollo-server-express');
const { resolvers, typeDefs, context } = require('./graphql');
const routes = require('./routes');

require('dotenv').config();
const app = express();
const corsOptions = {
  origin: process.env.BASE_URL,
  credentials: true,
};

// register graphql server
app.use(cors(corsOptions));
const server = new ApolloServer({ typeDefs, resolvers, context, cors: false });
server.applyMiddleware({
  app,
  cors: false,
  path: '/api/graphql',
});

// register login and logout route
app.use(express.urlencoded({ extended: true }));
app.use('/', routes);

app.listen({ port: process.env.API_PORT }, () =>
  console.log(`🚀 Server ready at ${process.env.API_BASE_URL}/graphql`),
);
