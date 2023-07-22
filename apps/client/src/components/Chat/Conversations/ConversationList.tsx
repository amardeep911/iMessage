import { Box, Text } from '@chakra-ui/react';
import { Session } from 'next-auth';
import React, { useState } from 'react';
import { ConversationPopulated } from '../../../../../server/util/type';
import ConversationItem from './ConversatonItem';
import ConversationModal from './Modal/ConversationModal';

interface ConversationListProps {
  session: Session;
  conversations: Array<ConversationPopulated>;
}

export const ConversationList: React.FC<ConversationListProps> = ({
  session,
  conversations,
}) => {
  const [isOpen, setisOpen] = useState(false);

  const onOpen = () => setisOpen(true);
  const onClose = () => setisOpen(false);

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
      {conversations.map(conversation => (
        <ConversationItem conversation={conversation} key={conversation.id} />
      ))}
    </Box>
  );
};
