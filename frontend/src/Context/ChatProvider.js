import React, { createContext, useContext, useEffect, useState } from "react";
import { useHistory } from "react-router-dom";

const ChatContext = createContext();

const ChatProvider = ({ children }) => {
  const [selectedChat, setSelectedChat] = useState();
  const [user, setUser] = useState(null); // Initialize as null instead of undefined
  const [notification, setNotification] = useState([]);
  const [chats, setChats] = useState();
  const [appTheme, setAppTheme] = useState(() => {
    // Load theme from localStorage, or default to 'light'
    return localStorage.getItem("appTheme") || "light";
  });

  const history = useHistory();

  // Check for user in localStorage and redirect if not logged in
  useEffect(() => {
    const userInfo = JSON.parse(localStorage.getItem("userInfo"));
    if (userInfo) {
      setUser(userInfo);  // Set user if found in localStorage
    } else {
      history.push("/");  // Redirect to the homepage if no user is found
    }
  }, [history]);

  // Persist theme for the current user (if logged in)
  useEffect(() => {
    if (user && user._id) {
      localStorage.setItem(`appTheme:${user._id}`, appTheme);  // Save theme for the specific user
    }
    // Also save a generic theme for users who aren't logged in
    localStorage.setItem("appTheme", appTheme);
  }, [appTheme, user]);

  // Load user-specific theme if available
  useEffect(() => {
    if (user && user._id) {
      const savedTheme = localStorage.getItem(`appTheme:${user._id}`);
      if (savedTheme) {
        setAppTheme(savedTheme);  // Load user's specific theme if available
      }
    }
  }, [user]);

  return (
    <ChatContext.Provider
      value={{
        selectedChat,
        setSelectedChat,
        user,
        setUser,
        notification,
        setNotification,
        chats,
        setChats,
        appTheme,
        setAppTheme,
      }}
    >
      {children}
    </ChatContext.Provider>
  );
};

export const ChatState = () => {
  return useContext(ChatContext);
};

export default ChatProvider;
