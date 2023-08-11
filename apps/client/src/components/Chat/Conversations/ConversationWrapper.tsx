import { gql, useApolloClient, useMutation, useQuery } from '@apollo/client';
import { Box } from '@chakra-ui/react';
import SkeletonLoader from '@src/components/common/SkeletonLoader';
import { ConversationsData } from '@src/util/types';
import { Session } from 'next-auth';
import { useRouter } from 'next/router';
import React, { useEffect } from 'react';
import {
  ConversationPopulated,
  ParticipantPopulated,
} from '../../../../../server/util/type';
import conversationOperation from '../../../graphql/operations/conversation';
import { ConversationList } from './ConversationList';

interface ConversationWrapperProps {
  session: Session;
}

export const ConversationWrapper: React.FC<ConversationWrapperProps> = ({
  session,
}) => {
  const router = useRouter();
  const { conversationId } = router.query;
  const { id: userId } = session.user;
  const client = useApolloClient(); // Get the Apollo Client instance

  const {
    data: conversationsData,
    error: conversationError,
    loading: conversationLoading,
    subscribeToMore,
  } = useQuery<ConversationsData>(conversationOperation.Queries.conversations);

  const [markConversationAsRead] = useMutation<
    { markConversationAsRead: boolean },
    { conversationId: string; userId: string }
  >(conversationOperation.Mutations.markConversationAsRead);

  const onViewConversation = async (
    conversationId: string,
    hasSeenLatestMessage: boolean | undefined
  ) => {
    router.push({ query: { conversationId } });

    if (hasSeenLatestMessage) return;

    try {
      await markConversationAsRead({
        variables: {
          userId,
          conversationId,
        },
        optimisticResponse: {
          markConversationAsRead: true,
        },
        update: cache => {
          const participantsFragment = cache.readFragment<{
            participants: Array<ParticipantPopulated>;
          }>({
            id: `Conversation:${conversationId}`,
            fragment: gql`
              fragment Participants on Conversation {
                participants {
                  user {
                    id
                    username
                  }
                  hasSeenLatestMessage
                }
              }
            `,
          });

          if (!participantsFragment) return;

          const participants = [...participantsFragment.participants];

          const userParticipantIdx = participants.findIndex(
            p => p.user.id === userId
          );

          if (userParticipantIdx === -1) return;

          const userParticipant = participants[userParticipantIdx];

          participants[userParticipantIdx] = {
            ...userParticipant,
            hasSeenLatestMessage: true,
          };

          cache.writeFragment({
            id: `Conversation:${conversationId}`,
            fragment: gql`
              fragment UpdatedParticipant on Conversation {
                participants
              }
            `,
            data: {
              participants,
            },
          });
        },
      });
    } catch (error) {
      console.log('onViewConversation error', error);
    }
  };

  // const subscribeToNewConversations = () => {
  //   subscribeToMore({
  //     document: conversationOperation.Subscriptions.conversationCreated,
  //     updateQuery: (
  //       prev,
  //       {
  //         subscriptionData,
  //       }: {
  //         subscriptionData: {
  //           data: { conversationCreated: ConversationPopulated };
  //         };
  //       }
  //     ) => {
  //       if (!subscriptionData.data) return prev;

  //       const newConversation = subscriptionData.data.conversationCreated;

  //       const alreadyExists = prev.conversations.find(
  //         c => c.id === newConversation.id
  //       );

  //       if (alreadyExists) return prev;

  //       return Object.assign({}, prev, {
  //         conversations: [newConversation, ...prev.conversations],
  //       });
  //     },
  //   });
  // };

  useEffect(() => {
    const unsubscribe = subscribeToMore({
      document: conversationOperation.Subscriptions.conversationCreated,
      updateQuery: (
        prev,
        {
          subscriptionData,
        }: {
          subscriptionData: {
            data: { conversationUpdated: ConversationPopulated };
          };
        }
      ) => {
        if (!subscriptionData.data) return prev;

        const updatedConversation = subscriptionData.data.conversationUpdated;

        const alreadyExists = prev.conversations.find(
          c => c.id === updatedConversation.id
        );

        if (!alreadyExists) return prev;

        //free the

        return Object.assign({}, prev, {
          conversations: prev.conversations.map(c =>
            c.id === updatedConversation.id ? updatedConversation : c
          ),
        });
      },
    });

    return () => {
      unsubscribe();
    };
  }, [conversationId]);

  if (conversationError) {
    console.log('conversationError', conversationError);
    return null;
  }

  return (
    <Box
      width={{ base: '100%', md: '400px' }}
      bg="whiteAlpha.50"
      py={6}
      px={3}
      gap={3}
      flexDirection="column"
      display={{ base: conversationId ? 'none' : 'flex', md: 'flex' }}
    >
      {conversationLoading ? (
        <SkeletonLoader count={7} height="80px" />
      ) : (
        <ConversationList
          session={session}
          conversations={conversationsData?.conversations || []}
          onViewConversation={onViewConversation}
        />
      )}
    </Box>
  );
};
