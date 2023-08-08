import { useQuery } from '@apollo/client';
import { Box } from '@chakra-ui/react';
import { ConversationsData } from '@src/util/types';
import { Session } from 'next-auth';
import { useRouter } from 'next/router';
import React, { useEffect } from 'react';
import { ConversationPopulated } from '../../../../../server/util/type';
import conversationOperation from '../../../graphql/operations/conversation';
import { ConversationList } from './ConversationList';

interface ConversationWrapperProps {
  session: Session;
}

export const ConversationWrapper: React.FC<ConversationWrapperProps> = ({
  session,
}) => {
  const {
    data: conversationsData,
    error: conversationError,
    loading: conversationLoading,
    subscribeToMore,
  } = useQuery<ConversationsData>(conversationOperation.Queries.conversations);
  const router = useRouter();
  const { conversationId } = router.query;

  const onViewConversation = async (conversationId: string) => {
    //1 push the coverstation id to the url
    router.push({ query: { conversationId } });
    //2 Mark the conversation as read
  };

  const subscribeToNewConversation = () => {
    subscribeToMore({
      document: conversationOperation.Subscriptions.conversationCreated,
      updateQuery: (
        prev,
        {
          subscriptionData,
        }: {
          subscriptionData: {
            data: { conversationCreated: ConversationPopulated };
          };
        }
      ) => {
        // Check if subscriptionData.data exists and is valid
        if (!subscriptionData.data) return prev;
        const newConversation = subscriptionData.data.conversationCreated;
        // Check if the new conversation is already in the cache
        if (
          prev.conversations.find(
            conversation => conversation.id === newConversation.id
          )
        ) {
          return prev;
        }
        // Add the new conversation to the cache

        return Object.assign({}, prev, {
          conversations: [newConversation, ...prev.conversations],
        });
      },
    });
  };

  useEffect(() => {
    subscribeToNewConversation();
  }, []);

  return (
    <Box
      width={{ base: '100%', md: '400px' }}
      bg="whiteAlpha.50"
      py={6}
      px={3}
      display={{ base: conversationId ? 'none' : 'flex', md: 'flex' }}
    >
      {/* Skeleton loader */}
      <ConversationList
        session={session}
        conversations={conversationsData?.conversations || []}
        onViewConversation={onViewConversation}
      />
    </Box>
  );
};
