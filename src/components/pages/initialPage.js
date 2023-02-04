import React from "react";
import "../styles/InitialPage.css";

const InitialPage = ({ stateChanger }) => {
  const [page, setPage] = React.useState(false);
  const [nameStored, setNameStored] = React.useState(false);

  React.useEffect(() => {
    const nameCheck = localStorage.getItem("name");
    if (nameCheck) {
      setNameStored(true);
    }
  }, []);

  const Initial = () => {
    return (
      <React.Fragment>
        <div className="initialPageContentText">nsutRADIO</div>
        <button
          onClick={() => handleClick()}
          className="initialPageContentButton"
        >
          Join
        </button>
      </React.Fragment>
    );
  };
  const Final = () => {
    const [name, setName] = React.useState("");
    if (nameStored) {
      setTimeout(() => {
        stateChanger(true);
      }, 4000);
      return <div className="initialPageContentText">Welcome!!</div>;
    }
    return (
      <React.Fragment>
        <div className="initialPageContentText">nsutRADIO</div>
        <input
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Name"
          className="initialPageContentInput"
        />
        <button
          onClick={() => handleClickSubmit(name)}
          className="initialPageContentButton"
          style={{ marginTop: "10px" }}
        >
          Enter
        </button>
      </React.Fragment>
    );
  };

  const handleClick = () => {
    console.log("clicked");
    setPage(true);
  };
  const handleClickSubmit = React.useCallback((name) => {
    localStorage.setItem("name", name);
    console.log("clicked");
    setNameStored(true);
  }, []);
  return (
    <div className="initialPageMainContainer">
      <div className="initialPageContentContainer">
        <div className="initialPageContent">
          <div className="initialPageContentBorder">
            {page ? <Final /> : <Initial />}
          </div>
        </div>
      </div>
    </div>
  );
};

export default InitialPage;
