import React from "react";
import "../styles/chatRoom.css";

const PageBtn = ({ stateChanger }) => {
  return (
    <React.Fragment>
      <button
        onClick={() => stateChanger(true)}
        className="chatRoomContentButton"
      >
        Let's Start
      </button>
    </React.Fragment>
  );
};

const Page = () => {
  //   const [messages, setMessages] = React.useState([]);
  //   const [message, setMessage] = React.useState("");
  const [name, setName] = React.useState("");
  const [nameStored, setNameStored] = React.useState(false);
  //   const [socket, setSocket] = React.useState(null);
  //   const [connected, setConnected] = React.useState(false);

  React.useEffect(() => {
    const nameCheck = localStorage.getItem("name");
    if (nameCheck) {
      setNameStored(true);
    }
  }, []);

  const handleClickSubmit = (name) => {
    localStorage.setItem("name", name);
    setNameStored(true);
  };

  if (!nameStored) {
    return (
      <React.Fragment>
        <div className="chatRoomContentText">nsutRADIO</div>
        <input
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Name"
          className="chatRoomContentInput"
        />
        <button
          onClick={() => handleClickSubmit(name)}
          className="chatRoomContentButton"
          style={{ marginTop: "10px" }}
        >
          Enter
        </button>
      </React.Fragment>
    );
  } else {
    return (
      <React.Fragment>
        <div className="chatRoomContentText">nsutRADIO</div>
        <div className="chatRoomContentText">
          Welcome {localStorage.getItem("name")}!!
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
        {page ? <Page /> : <PageBtn stateChanger={setPage} />}
      </div>
    </React.Fragment>
  );
};

export default Chatroom;
