import { PubSub } from 'graphql-subscriptions';
import { Context } from 'graphql-ws/lib/server';
import { ISODateString } from 'next-auth';
import { Prisma, PrismaClient } from 'prisma/prisma-client';
import {
  conversationPopulated,
  participantPopulated,
} from '../src/graphql/resolvers/conversation';
//serveer configuration
export interface GraphQLContext {
  session: Session | null;
  prisma: PrismaClient;
  pubsub: PubSub;
}
export interface Session {
  user: User;
  expires: ISODateString;
}

export interface SubscriptionContext extends Context {
  connectionParams: {
    session?: Session;
  };
}

export interface CreateUsernameResponse {
  success?: boolean;
  error?: string;
}
//conversations
export type ConversationPopulated = Prisma.ConversationGetPayload<{
  include: typeof conversationPopulated;
}>;

export type ParticipantPopulated = Prisma.ConversationParticipantGetPayload<{
  include: typeof participantPopulated;
}>;

//users
export interface User {
  id: string;
  username: string;
  image: string;
  email: string;
  name: string;
}
