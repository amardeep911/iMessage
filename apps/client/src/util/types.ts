//user types
import { ConversationPopulated } from '../../../server/util/type';
export interface CreateUsernameData {
  createUsername: {
    success: boolean;
    error: string;
  };
}
export interface CreateUsernameVariables {
  username: string;
}
export interface SearchUsersInput {
  username: string;
}

export interface SearchUsersData {
  searchUsers: Array<SearchedUsers>;
}

export interface SearchedUsers {
  id: string;
  username: string;
}

//conversation types

export interface ConversationsData {
  conversations: Array<ConversationPopulated>;
}

export interface CreateConversationData {
  createConversation: {
    conversationId: string;
  };
}

export interface CreateConversationInput {
  participantIds: Array<string>;
}
