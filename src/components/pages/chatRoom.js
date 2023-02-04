import React from "react";
// import { Socket } from "socket.io-client";
import io from "socket.io-client";
import "../styles/chatRoom.css";

const socket_key = process.env.REACT_APP_SOCKET_URL;
console.log(socket_key);
const socket = io.connect(socket_key);
socket.emit("join");

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
          className="chatRoomInitialInput chatRoomFinalMessageInputContainer"
        />
        <button
          onClick={() => handleClickSubmit(name)}
          className="chatRoomInitialButton"
        ></button>
      </React.Fragment>
    );
  } else {
    const Chat = () => {
      const [messages, setMessages] = React.useState([]);
      React.useEffect(() => {
        socket.on("recieve_message", (data) => {
          console.log("running twice");
          setMessages([...messages, data]);
        });
      }, [messages]);

      return (
        <React.Fragment>
          <div
            className="chatRoomFinalChatContainer"
            style={{ overflowY: "scroll" }}
          >
            {messages.map((message, index) => {
              return (
                <div className="chatRoomFinalChat" key={index}>
                  <span className="chatRoomFinalChatName">
                    {message[0]}&nbsp;:&nbsp;
                  </span>
                  <span className="chatRoomFinalChatMessage">{message[1]}</span>
                </div>
              );
            })}
          </div>
        </React.Fragment>
      );
    };

    const ChatInput = () => {
      const [message, setMessage] = React.useState("");
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

        setMessage("");
        socket.emit("message", data);
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
        if (!nameStored) {
          document.getElementsByClassName("chatRoomInitialInput")[0].onkeydown =
            function (e) {
              if (e.keyCode === 13) {
                handleClickSubmit(name);
              }
            };
        }
      }, [sendMessage]);
      return (
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
          <div className="chatRoomFinalClose">
            <div
              className="chatRoomFinalCloseBtnContainer"
              onClick={() => {
                closeChatRoom();
              }}
            ></div>
          </div>
        </div>
      );
    };

    return (
      <React.Fragment>
        <div className="chatRoomFinalContainer">
          <div className="chatRoomFinalContent">
            <Chat />
          </div>
          <ChatInput />
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
