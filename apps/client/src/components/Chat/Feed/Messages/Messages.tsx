import { useQuery } from '@apollo/client';
import { Flex, Stack } from '@chakra-ui/react';
import SkeletonLoader from '@src/components/common/SkeletonLoader';
import MessageOperation from '@src/graphql/operations/message';
import {
  MessageData,
  MessageSubscriptionData,
  MessageVariables,
} from '@src/util/types';
import { useEffect } from 'react';
import { toast } from 'react-hot-toast';
import MessageItem from './MessageItem';

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

  if (error) {
    console.log(error);
    toast.error(error.message);
  }

  const subscribeToNewMessage = (conversationId: string) => {
    subscribeToMore({
      document: MessageOperation.Subscription.messageSent,
      variables: {
        conversationId,
      },
      updateQuery: (prev, { subscriptionData }: MessageSubscriptionData) => {
        if (!subscriptionData.data) return prev;
        console.log('here is subscription data', subscriptionData.data);
        const newMessage = subscriptionData.data.messageSent;

        if (prev.messages.find(message => message.id === newMessage.id)) {
          return prev;
        }

        return Object.assign({}, prev, {
          messages: [...prev.messages, newMessage],
        });
      },
    });
  };

  useEffect(() => {
    subscribeToNewMessage(conversationId);
  }, [conversationId]);

  console.log('here is messaged data', data);

  return (
    <Flex direction="column" justify="flex-end" overflow="hidden">
      {loading && (
        <Stack spacing={4} px={4}>
          <SkeletonLoader count={4} height="60px" />
        </Stack>
      )}
      {data?.messages && (
        <Flex direction="column-reverse" overflowY="scroll" height="100%">
          {data.messages.map(message => (
            <MessageItem
              key={message.id}
              message={message}
              sentByMe={message.sender.id === userId}
            />
          ))}
        </Flex>
      )}
    </Flex>
  );
};

export default Messages;
