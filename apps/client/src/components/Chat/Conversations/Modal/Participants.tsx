import { Flex, Stack, Text } from '@chakra-ui/react';
import { SearchedUsers } from '@src/util/types';
import React from 'react';
import { IoIosCloseCircleOutline } from 'react-icons/io';

interface ParticipantsProps {
  participants: Array<SearchedUsers>;
  removeParticipant: (userId: string) => void;
}

const Participants: React.FC<ParticipantsProps> = ({
  participants,
  removeParticipant,
}) => {
  return (
    <Flex mt={8} gap="10px" flexWrap="wrap">
      {participants.map(participants => (
        <Stack
          direction="row"
          align="center"
          bg="whiteAlpha.200"
          borderRadius={4}
          p={2}
        >
          <Text>{participants.username}</Text>
          <IoIosCloseCircleOutline
            onClick={() => removeParticipant(participants.id)}
            cursor="pointer"
          />
        </Stack>
      ))}
    </Flex>
  );
};

export default Participants;
