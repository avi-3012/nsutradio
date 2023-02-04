import React from "react";
// import { Socket } from "socket.io-client";
import io from "socket.io-client";
import "../styles/chatRoom.css";

const socket_key = process.env.REACT_APP_SOCKET_URL;
const socket = io.connect(socket_key);
socket.emit("join");
socket.on("recieve_message", (data) => {
  console.log(data);
});

const PageBtn = ({ stateChanger }) => {
  return (
    <React.Fragment>
      <div className="ChatroomBtn" onClick={() => stateChanger(true)}>
        Chat Room
        <div className="ChatroomBtnImage"></div>
      </div>
    </React.Fragment>
  );
};

const Page = ({ stateChanger }) => {
  const [message, setMessage] = React.useState("");
  const [name, setName] = React.useState("");
  const [nameStored, setNameStored] = React.useState(false);
  console.log(socket_key);

  React.useEffect(() => {
    console.log("useEffect running");
    const nameCheck = localStorage.getItem("name");
    if (nameCheck) {
      setNameStored(true);
    }
  }, []);

  const handleClickSubmit = (name) => {
    localStorage.setItem("name", name);
    setNameStored(true);
  };

  const sendMessage = React.useCallback(() => {
    var data = [localStorage.getItem("name"), message];
    if (
      message === "" ||
      message === null ||
      data[0] === "" ||
      data[0] === null
    ) {
      if (data[0] === "" || data[0] === null) {
        alert("Invalid Name!! Please reload the page.");
        return;
      }
      return;
    }

    socket.emit("message", data);
    setMessage("");
  }, [message]);

  React.useEffect(() => {
    if (nameStored) {
      document.getElementsByClassName(
        "chatRoomFinalMessageInputContainer"
      )[0].onkeydown = function (e) {
        if (e.keyCode === 13) {
          sendMessage();
        }
      };
    }
  }, [nameStored, sendMessage]);

  const closeChatRoom = () => {
    stateChanger(false);
  };

  if (!nameStored) {
    return (
      <React.Fragment>
        <input
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Name"
          className="chatRoomInitialInput"
        />
        <button
          onClick={() => handleClickSubmit(name)}
          className="chatRoomInitialButton"
          style={{ marginTop: "10px" }}
        >
          Enter
        </button>
      </React.Fragment>
    );
  } else {
    return (
      <React.Fragment>
        <div className="chatRoomFinalContainer">
          <div className="chatRoomFinalContent"></div>
          <div className="chatRoomFinalMessage">
            <div className="chatRoomFinalMessageContainer">
              <input
                type="text"
                className="chatRoomFinalMessageInputContainer"
                placeholder="Send Message"
                value={message}
                onChange={(e) => {
                  console.log(e.target.value);
                  setMessage(e.target.value);
                }}
              />
            </div>
            <div className="chatRoomFinalSend">
              <div
                className="chatRoomFinalCloseBtnContainer"
                onClick={() => {
                  closeChatRoom();
                }}
              ></div>
            </div>
          </div>
        </div>
      </React.Fragment>
    );
  }
};

const Chatroom = () => {
  const [page, setPage] = React.useState(false);

  return (
    <React.Fragment>
      <div className="chatRoomContainer">
        {page ? (
          <Page stateChanger={setPage} />
        ) : (
          <PageBtn stateChanger={setPage} />
        )}
      </div>
    </React.Fragment>
  );
};

export default Chatroom;
