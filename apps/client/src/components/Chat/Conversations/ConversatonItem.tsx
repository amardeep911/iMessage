import { Stack, Text } from '@chakra-ui/react';
import React from 'react';
import { ConversationPopulated } from '../../../../../server/util/type';

interface ConversationItemProp {
  conversation: ConversationPopulated;
}

const ConversationItem: React.FC<ConversationItemProp> = ({ conversation }) => {
  return (
    <Stack p={4} _hover={{ bg: 'whiteAlpha.200' }} borderRadius={4}>
      <Text>{conversation.id}</Text>
    </Stack>
  );
};

export default ConversationItem;
