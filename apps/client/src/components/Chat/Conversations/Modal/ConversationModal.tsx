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
import React, { useState } from 'react';

interface ModalProp {
  isOpen: boolean;
  onClose: () => void;
}

const ConversationModal: React.FC<ModalProp> = ({ isOpen, onClose }) => {
  const [username, setusername] = useState('');

  const onSearch = async (event: React.FormEvent) => {
    event.preventDefault();
    //search user query
    console.log('onsubmit', username);
  };

  return (
    <>
      <Modal isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent bg="#2d2d2d" pb={4}>
          <ModalHeader>Modal Title</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <form onSubmit={onSearch}>
              <Stack>
                <Input
                  placeholder="Enter a username"
                  value={username}
                  onChange={e => setusername(e.target.value)}
                />
                <Button type="submit" disabled={!username}>
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
