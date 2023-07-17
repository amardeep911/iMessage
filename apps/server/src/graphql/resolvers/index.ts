import merge from 'lodash.merge';
import conversationResolver from './conversation';
import userResolvers from './user';

const resolvers = merge({}, userResolvers, conversationResolver);

export default resolvers;
