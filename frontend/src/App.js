import "./App.css";
import Homepage from "./Pages/Homepage";
import { Route, Switch, Redirect } from "react-router-dom"; // Add Redirect to control routing
import Chatpage from "./Pages/Chatpage";
import { ChatState } from "./Context/ChatProvider"; // Assuming you're using context to manage user state

function App() {
  const { user } = ChatState();  // Get user from context (or localStorage)

  return (
    <div className="App">
      <Switch>
        {/* Default route */}
        <Route exact path="/">
          {!user ? <Homepage /> : <Redirect to="/chats" />} {/* Show Homepage if not logged in, else redirect to Chat */}
        </Route>

        {/* Login Route */}
        <Route path="/login">
          {!user ? <Homepage /> : <Redirect to="/chats" />} {/* Show Login if not logged in */}
        </Route>

        {/* Chat Route */}
        <Route path="/chats">
          {user ? <Chatpage /> : <Redirect to="/login" />} {/* Show Chat only if user is logged in */}
        </Route>
      </Switch>
    </div>
  );
}

export default App;
