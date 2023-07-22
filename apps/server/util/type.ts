import { ISODateString } from 'next-auth';
import { Prisma, PrismaClient } from 'prisma/prisma-client';
import {
  conversationPopulated,
  participantPopulated,
} from '../src/graphql/resolvers/conversation';

export interface GraphQLContext {
  session: Session | null;
  prisma: PrismaClient;
  // pubsub: any;
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

export interface Session {
  user: User;
  expires: ISODateString;
}
export interface User {
  id: string;
  username: string;
  image: string;
  email: string;
  name: string;
}
