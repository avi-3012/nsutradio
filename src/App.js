import "./App.css";
import React from "react";
import InitialPage from "./components/pages/initialPage";
import MainPage from "./components/pages/mainPage";
import Chatroom from "./components/pages/chatRoom";
import Playlist from "./components/pages/playlist";
import io from "socket.io-client";

const socket_key = process.env.REACT_APP_SOCKET_URL;
console.log(socket_key);
const socket = io.connect(socket_key);
socket.emit("join");

function App() {
  // console.log(playlist);

  const Main = ({ socket }) => {
    // console.log(playlist);
    const [page, setPage] = React.useState(false);
    return (
      <React.Fragment>
        {page ? (
          <MainPage stateChanger={setPage} socket={socket} />
        ) : (
          <InitialPage stateChanger={setPage} socket={socket} />
        )}
      </React.Fragment>
    );
  };
  return (
    <div>
      <div
        style={{
          position: "absolute",
          color: "grey",
          bottom: "4px",
          textAlign: "center",
          width: "100%",
          fontStyle: "italic",
          fontSize: "small",
        }}
      >
        - Developed by Electroverts -
      </div>
      <div className="container">
        <Main socket={socket} />
        <Chatroom socket={socket} />
        <Playlist socket={socket} />
      </div>
    </div>
  );
}

export default App;
