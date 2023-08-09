import merge from 'lodash.merge';
import conversationResolver from './conversation';
import messageResolvers from './message';
import scalarResolvers from './scalars';
import userResolvers from './user';

const resolvers = merge(
  {},
  userResolvers,
  conversationResolver,
  messageResolvers,
  scalarResolvers
);

export default resolvers;
