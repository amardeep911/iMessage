import { ApolloServer } from '@apollo/server';
import { expressMiddleware } from '@apollo/server/express4';
import { ApolloServerPluginDrainHttpServer } from '@apollo/server/plugin/drainHttpServer';
import { makeExecutableSchema } from '@graphql-tools/schema';
import { json } from 'body-parser';
import cors from 'cors';
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

  const server = new ApolloServer({
    schema,
    csrfPrevention: true,
    plugins: [
      ApolloServerPluginDrainHttpServer({ httpServer }),
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
    // context: async ({ req, res }): Promise<GraphQLContext> => {
    //   const session = (await getSession({ req })) as Session;
    //   console.log('session', session);
    //   return { session, prisma, pubsub };
    // },
  });
  await server.start();
  const corsOptions = {
    origin: process.env.CLIENT_ORIGIN,
    credentials: true,
  };

  app.use(
    '/graphql',
    cors<cors.CorsRequest>(corsOptions),
    json(),
    expressMiddleware(server, {
      context: async ({ req }): Promise<GraphQLContext> => {
        const session = await getSession({ req });
        return { session: session as Session, prisma, pubsub };
      },
    })
  );
  const PORT = 4000;
  await new Promise<void>(resolve =>
    httpServer.listen({ port: PORT }, resolve)
  );
  console.log(`🚀 Server ready at http://localhost:${PORT}/graphql`);
}

main().catch(error => console.error(error));
