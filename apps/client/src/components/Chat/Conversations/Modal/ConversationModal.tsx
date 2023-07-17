import { useLazyQuery } from '@apollo/client';
import {
  Button,
  Input,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalHeader,
  ModalOverlay,
  Stack,
} from '@chakra-ui/react';
import {
  SearchUsersData,
  SearchUsersInput,
  SearchedUsers,
} from '@src/util/types';
import React, { useState } from 'react';
import { toast } from 'react-hot-toast';
import UserOperations from '../../../../graphql/operations/user';
import Participants from './Participants';
import UserSearchList from './UserSearchList';

interface ModalProp {
  isOpen: boolean;
  onClose: () => void;
}

const ConversationModal: React.FC<ModalProp> = ({ isOpen, onClose }) => {
  const [username, setusername] = useState('');
  const [participants, setParticipants] = useState<Array<SearchedUsers>>([]);
  const [searchUsers, { data, loading, error }] = useLazyQuery<
    SearchUsersData,
    SearchUsersInput
  >(UserOperations.Queries.searchUsers);

  console.log('here is seached data', data);

  const onSearch = (event: React.FormEvent) => {
    event.preventDefault();

    searchUsers({ variables: { username } });

    console.log('onsubmit', username);
  };

  const addParticipant = (user: SearchedUsers) => {
    setParticipants(prev => [...prev, user]);
    setusername('');
  };

  const removeParticipant = (userId: string) => {
    setParticipants(prev => prev.filter(u => u.id !== userId));
  };

  const onCreateConversation = async () => {
    try {
      // create conversation
    } catch (error: any) {
      console.log('error creating conversation', error);
      toast.error(error?.message);
    }
  };

  return (
    <>
      <Modal isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent bg="#2d2d2d" pb={4}>
          <ModalHeader>Create a conversation</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <form onSubmit={onSearch}>
              <Stack>
                <Input
                  placeholder="Enter a username"
                  value={username}
                  onChange={e => setusername(e.target.value)}
                />
                <Button type="submit" disabled={!username} isLoading={loading}>
                  Search
                </Button>
              </Stack>
            </form>
            {data?.searchUsers && (
              <UserSearchList
                user={data.searchUsers}
                addParticipant={addParticipant}
              />
            )}
            {participants.length !== 0 && (
              <>
                <Participants
                  participants={participants}
                  removeParticipant={removeParticipant}
                />
                <Button
                  bg="brand.100"
                  width="100%"
                  mt={6}
                  _hover={{ bg: 'brand.100' }}
                  onClick={() => console.log('create conversation')}
                >
                  Create conversation
                </Button>
              </>
            )}
          </ModalBody>
        </ModalContent>
      </Modal>
    </>
  );
};

export default ConversationModal;
