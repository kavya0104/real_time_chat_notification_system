import { Box, Flex, Button } from "@chakra-ui/react";
import { useState, useEffect } from "react";
import Chatbox from "../components/Chatbox";
import MyChats from "../components/MyChats";
import SideDrawer from "../components/miscellaneous/SideDrawer";
import { ChatState } from "../Context/ChatProvider";
import ChatInfoPanel from "../components/ChatInfoPanel";
import NewMessagePanel from "../components/panels/NewMessagePanel";
import axios from "axios";
import UserModal from "../components/UserModal"; // Correct import for the UserModal component

const Chatpage = () => {
  const [fetchAgain, setFetchAgain] = useState(false);
  const { user, appTheme } = ChatState();
  const [showInfo, setShowInfo] = useState(false);
  const [mode, setMode] = useState("chat");
  const [groups, setGroups] = useState([]); // Groups of the current user
  const [selectedUsers, setSelectedUsers] = useState([]);
  const [showUserModal, setShowUserModal] = useState(false);

  useEffect(() => {
    // Fetch groups the user is a part of
    const fetchGroups = async () => {
      try {
        const response = await axios.get("http://localhost:5000/api/groups/get-groups", {
          headers: { Authorization: `Bearer ${user.token}` },
        });
        setGroups(response.data);
      } catch (error) {
        console.error("Error fetching groups", error);
      }
    };

    if (user) {
      fetchGroups();
    }
  }, [user, fetchAgain]);

  const handleCreateGroup = async () => {
    // Create the group and add selected users to it
    try {
      const response = await axios.post("http://localhost:5000/api/groups/create-group", {
        groupName: "New Group", // Replace with dynamic name if required
        createdBy: user._id,
        members: selectedUsers.map((user) => user._id),
      });
      setFetchAgain(!fetchAgain); // To trigger a refresh of groups
      setShowUserModal(false); // Close user modal after creating group
    } catch (error) {
      console.error("Error creating group", error);
    }
  };

  return (
    <div style={{ width: "100%" }}>
      {user && <SideDrawer />}
      <Flex
        justifyContent="space-between"
        w="100%"
        h="100vh"
        p={{ base: 2, md: 4 }}
        bg={appTheme === "dark" ? "gray.900" : "gray.50"}
      >
        {user && (
          <MyChats
            fetchAgain={fetchAgain}
            variant="light"
            containerProps={{
              w: { base: "0", md: "28%" },
              display: { base: "none", md: "flex" },
              h: "100%",
            }}
            onStartNew={() => setMode("new")}
            onSelectChat={() => setMode("chat")}
            groups={groups} // Pass groups to the sidebar
          />
        )}
        {user && (
          mode === "new" ? (
            <Box flex={1} mx={{ base: 0, md: 4 }} h="100%">
              <NewMessagePanel />
            </Box>
          ) : (
            <Chatbox
              fetchAgain={fetchAgain}
              setFetchAgain={setFetchAgain}
              variant={appTheme === "dark" ? "dark" : "light"}
              containerProps={{ flex: 1, mx: { base: 0, md: 4 }, h: "100%" }}
              onToggleInfo={() => setShowInfo((v) => !v)}
            />
          )
        )}
        {user && showInfo && <ChatInfoPanel chat={ChatState().selectedChat} />}
      </Flex>

      {/* Button to open user modal for group creation */}
      <Button onClick={() => setShowUserModal(true)} colorScheme="teal" variant="solid">
        Create Group
      </Button>

      {/* Render UserModal to select users for creating a group */}
      {showUserModal && (
        <UserModal
          onSelectUser={(user) => setSelectedUsers([...selectedUsers, user])}
          closeModal={() => setShowUserModal(false)}
          selectedUsers={selectedUsers}
        />
      )}
    </div>
  );
};

export default Chatpage;
