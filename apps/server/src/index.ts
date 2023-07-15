import { makeExecutableSchema } from '@graphql-tools/schema';
import {
  ApolloServerPluginDrainHttpServer,
  ApolloServerPluginLandingPageLocalDefault,
} from 'apollo-server-core';
import { ApolloServer } from 'apollo-server-express';
import * as dotenv from 'dotenv';
import express from 'express';
import http from 'http';
import { getSession } from 'next-auth/react';
import { PrismaClient } from 'prisma/prisma-client';
import { GraphQLContext, Session } from '../util/type';
import resolvers from './graphql/resolvers';
import typeDefs from './graphql/typeDefs';
async function main() {
  dotenv.config();
  const app = express();
  const httpServer = http.createServer(app);

  const schema = makeExecutableSchema({
    typeDefs,
    resolvers,
  });

  const corsOptions = {
    origin: process.env.CLIENT_ORIGIN,
    credentials: true,
  };
  // context parameter

  const prisma = new PrismaClient();

  const server = new ApolloServer({
    schema,
    csrfPrevention: true,
    cache: 'bounded',
    plugins: [
      ApolloServerPluginDrainHttpServer({ httpServer }),
      ApolloServerPluginLandingPageLocalDefault({ embed: true }),
    ],
    context: async ({ req, res }): Promise<GraphQLContext> => {
      const session = (await getSession({ req })) as Session;
      console.log('session', session);
      return { session, prisma };
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
