const { resolvers } = require('./resolvers');
const { typeDefs } = require('./schema');
const { context } = require('./context');

module.exports = {
  resolvers,
  typeDefs,
  context,
};
