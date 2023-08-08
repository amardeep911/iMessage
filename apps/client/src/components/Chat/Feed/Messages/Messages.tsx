import { useQuery } from '@apollo/client';
import { Flex, Stack } from '@chakra-ui/react';
import MessageOperation from '@src/graphql/operations/message';
import { MessageData, MessageVariables } from '@src/util/types';
import { toast } from 'react-hot-toast';

interface MessageProp {
  userId: string;
  conversationId: string;
}
const Messages: React.FC<MessageProp> = ({ userId, conversationId }) => {
  const { data, loading, error, subscribeToMore } = useQuery<
    MessageData,
    MessageVariables
  >(MessageOperation.Query.messages, {
    variables: {
      conversationId,
    },
    onError: err => {
      console.log(err);
      toast.error(err?.message);
    },
  });

  console.log('here is messaged data', data);

  return (
    <Flex direction="column" justify="flex-end" overflow="hidden">
      {loading && (
        <Stack>
          {/* <SkeletonLoader count={4} height="60px" width="100%" /> */}
          <span>Loading messages</span>
        </Stack>
      )}
      {data?.messages && (
        <Flex direction="column-reverse" overflowY="scroll" height="100%">
          {data.messages.map(message => (
            // <MessageITemm/>
            <div key={message.id}>{message.body}</div>
          ))}
        </Flex>
      )}
    </Flex>
  );
};

export default Messages;
