import { GraphQLContext } from '../../../util/type';

const resolvers = {
  // Query: {},
  Mutation: {
    createConversation: async (
      _: any,
      args: { paritcipantIds: Array<string> },
      context: GraphQLContext
    ) => {
      console.log('INSIDE CREATE CONVERSATION', args);
    },
  },
};
export default resolvers;
