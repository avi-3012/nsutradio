import "./App.css";
import React from "react";
import InitialPage from "./components/pages/initialPage";
import MainPage from "./components/pages/mainPage";
import Chatroom from "./components/pages/chatRoom";

function App() {
  const [page, setPage] = React.useState(false);
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
        {page ? <MainPage /> : <InitialPage stateChanger={setPage} />}
        <Chatroom />
      </div>
    </div>
  );
}

export default App;
