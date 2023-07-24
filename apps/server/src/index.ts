import { makeExecutableSchema } from '@graphql-tools/schema';
import {
  ApolloServerPluginDrainHttpServer,
  ApolloServerPluginLandingPageLocalDefault,
} from 'apollo-server-core';
import { ApolloServer } from 'apollo-server-express';
import * as dotenv from 'dotenv';
import express from 'express';
import { PubSub } from 'graphql-subscriptions';
import { useServer } from 'graphql-ws/lib/use/ws';
import http from 'http';
import { getSession } from 'next-auth/react';
import { PrismaClient } from 'prisma/prisma-client';
import { WebSocketServer } from 'ws';
import { GraphQLContext, Session, SubscriptionContext } from '../util/type';
import resolvers from './graphql/resolvers';
import typeDefs from './graphql/typeDefs';
async function main() {
  dotenv.config();
  const app = express();
  const httpServer = http.createServer(app);

  const wsServer = new WebSocketServer({
    // This is the `httpServer` we created in a previous step.
    server: httpServer,
    // Pass a different path here if your ApolloServer serves at
    // a different path.
    path: '/graphql/subscriptions',
  });

  const schema = makeExecutableSchema({
    typeDefs,
    resolvers,
  });

  // context parameter

  const prisma = new PrismaClient();
  const pubsub = new PubSub();
  const serverCleanup = useServer(
    {
      schema,
      context: (ctx: SubscriptionContext): Promise<GraphQLContext> => {
        if (ctx.connectionParams && ctx.connectionParams.session) {
          const { session } = ctx.connectionParams;

          return Promise.resolve({ session, prisma, pubsub });
        }
        return Promise.resolve({ session: null, prisma, pubsub });
      },
    },
    wsServer
  );

  const corsOptions = {
    origin: process.env.CLIENT_ORIGIN,
    credentials: true,
  };

  const server = new ApolloServer({
    schema,
    csrfPrevention: true,
    cache: 'bounded',
    plugins: [
      ApolloServerPluginDrainHttpServer({ httpServer }),
      ApolloServerPluginLandingPageLocalDefault({ embed: true }),
      {
        async serverWillStart() {
          return {
            async drainServer() {
              await serverCleanup.dispose();
            },
          };
        },
      },
    ],
    context: async ({ req, res }): Promise<GraphQLContext> => {
      const session = (await getSession({ req })) as Session;
      console.log('session', session);
      return { session, prisma, pubsub };
    },
  });
  await server.start();
  server.applyMiddleware({ app, cors: corsOptions });
  await new Promise<void>(resolve =>
    httpServer.listen({ port: 4000 }, resolve)
  );
  console.log(`🚀 Server ready at http://localhost:4000${server.graphqlPath}`);
}

main().catch(error => console.error(error));
