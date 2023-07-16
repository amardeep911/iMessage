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
import { SearchUsersData, SearchUsersInput } from '@src/util/types';
import React, { useState } from 'react';
import UserOperations from '../../../../graphql/operations/user';

interface ModalProp {
  isOpen: boolean;
  onClose: () => void;
}

const ConversationModal: React.FC<ModalProp> = ({ isOpen, onClose }) => {
  const [username, setusername] = useState('');
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
          </ModalBody>
        </ModalContent>
      </Modal>
    </>
  );
};

export default ConversationModal;
