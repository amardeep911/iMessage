const resolvers = {
  // Query: {},
  Mutation: {
    createConversation: async () => {
      console.log('INSIDE CREATE CONVERSATION');
    },
  },
};
export default resolvers;
