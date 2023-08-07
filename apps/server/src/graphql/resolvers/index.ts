import merge from 'lodash.merge';
import conversationResolver from './conversation';
import messageResolvers from './message';
import userResolvers from './user';

const resolvers = merge(
  {},
  userResolvers,
  conversationResolver,
  messageResolvers
);

export default resolvers;
