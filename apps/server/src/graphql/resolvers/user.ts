import { GraphQLContext } from '../../../util/type';

const resolvers = {
  Query: {
    searchUsers: () => {},
  },
  Mutation: {
    createUsername: async (
      _: any,
      args: { username: string },
      context: GraphQLContext
    ) => {
      const { username } = args;
      const { session, prisma } = context;
      console.log('session', session);
      if (!session?.user) {
        return {
          error: 'You must be logged in to create a username',
        };
      }
      const { id: userId } = session.user;

      try {
        // check username is already present
        const existingUser = await prisma.user.findUnique({
          where: {
            username,
          },
        });

        //if found user
        if (existingUser) {
          return {
            error: 'Username already taken',
          };
        }

        //upate user
        await prisma.user.update({
          where: {
            id: userId,
          },
          data: {
            username,
          },
        });

        return {
          success: true,
        };
      } catch (error: any) {
        return {
          error: error?.message,
        };
      }
    },
  },
};

export default resolvers;
