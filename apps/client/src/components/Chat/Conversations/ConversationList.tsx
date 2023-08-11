import { Box, Text } from '@chakra-ui/react';
import { Session } from 'next-auth';
import { useRouter } from 'next/router';
import React, { useState } from 'react';
import {
  ConversationPopulated,
  ParticipantPopulated,
} from '../../../../../server/util/type';
import ConversationItem from './ConversatonItem';
import ConversationModal from './Modal/ConversationModal';

interface ConversationListProps {
  session: Session;
  conversations: Array<ConversationPopulated>;
  onViewConversation: (
    conversationId: string,
    hasSeenLatestMessage: boolean | undefined
  ) => void;
}

export const ConversationList: React.FC<ConversationListProps> = ({
  session,
  conversations,
  onViewConversation,
}) => {
  const [isOpen, setisOpen] = useState(false);

  const onOpen = () => setisOpen(true);
  const onClose = () => setisOpen(false);

  const router = useRouter();
  const {
    user: { id: userId },
  } = session;
  return (
    <Box width="100%">
      <Box
        py={2}
        px={4}
        bg={'blackAlpha.300'}
        borderRadius={4}
        cursor="pointer"
        onClick={onOpen}
      >
        <Text textAlign={'center'} color="whiteAlpha.800" fontWeight="500">
          Find or start a new conversation
        </Text>
      </Box>
      <ConversationModal session={session} isOpen={isOpen} onClose={onClose} />
      {conversations.map(conversation => {
        const participant = conversation.participants.find(
          (participant: ParticipantPopulated) => participant.user.id === userId
        );
        return (
          <ConversationItem
            key={conversation.id}
            userId={userId}
            conversation={conversation}
            onClick={() =>
              onViewConversation(
                conversation.id,
                participant?.hasSeenLatestMessage
              )
            }
            hasSeenLatestMessage={participant?.hasSeenLatestMessage}
            isSelected={conversation.id === router.query.conversationId}
          />
        );
      })}
    </Box>
  );
};
