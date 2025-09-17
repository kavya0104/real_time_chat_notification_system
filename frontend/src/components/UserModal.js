import React, { useState, useEffect } from "react";
import { Modal, ModalOverlay, ModalContent, ModalHeader, ModalCloseButton, ModalBody, Button, Checkbox, VStack } from "@chakra-ui/react";
import axios from "axios";

const UserModal = ({ onSelectUser, closeModal, selectedUsers }) => {
  const [users, setUsers] = useState([]); // Fetch users from API

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await axios.get("http://localhost:5000/api/users/get-users");
        setUsers(response.data); // Store users in state
      } catch (error) {
        console.error("Error fetching users:", error);
      }
    };

    fetchUsers(); // Fetch users on component mount
  }, []);

  const handleUserSelect = (user) => {
    // Check if user is already selected
    const isSelected = selectedUsers.some((selected) => selected._id === user._id);

    if (isSelected) {
      // If user is selected, remove them
      onSelectUser(selectedUsers.filter((selected) => selected._id !== user._id));
    } else {
      // If not selected, add them
      onSelectUser([...selectedUsers, user]);
    }
  };

  return (
    <Modal isOpen={true} onClose={closeModal}>
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>Select Users to Add to Group</ModalHeader>
        <ModalCloseButton />
        <ModalBody>
          <VStack spacing={4} align="stretch">
            {users.map((user) => (
              <Checkbox
                key={user._id}
                isChecked={selectedUsers.some((selected) => selected._id === user._id)}
                onChange={() => handleUserSelect(user)}
              >
                {user.username}
              </Checkbox>
            ))}
          </VStack>
          <Button mt={4} colorScheme="blue" onClick={closeModal}>
            Done
          </Button>
        </ModalBody>
      </ModalContent>
    </Modal>
  );
};

export default UserModal;
