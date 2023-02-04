import React from "react";
import "../styles/MainPage.css";
import YouTube from "react-youtube";

const MainPage = () => {
  const [count, setCount] = React.useState(0);
  const [audioTitle, setAudioTitle] = React.useState("Nothing Playing");
  var videos = ["jJPMnTXl63E", "MCFEKjCWivU", "6ZfuNTqbHE8"];

  const Player = () => {
    const [seekPosition] = React.useState(0);
    React.useEffect(() => {
      const fetchData = async () => {
        const response = await fetch(
          `https://www.googleapis.com/youtube/v3/videos?part=snippet&id=${videos[count]}&key=AIzaSyBq9Vj9JGZ2gO8CYujvXYaxOIsJUlZZVuU`
        );
        const data = await response.json();
        setAudioTitle(data.items[0].snippet.title);
      };
      fetchData();
    }, []);
    const opts = {
      height: "0",
      width: "0",
      playerVars: {
        // https://developers.google.com/youtube/player_parameters
        autoplay: 1,
        disablekb: 1,
        controls: 0,
      },
    };
    const onEnd = () => {
      setCount(count + 1);
    };
    const onReady = (event) => {
      event.target.seekTo(seekPosition);
    };

    return (
      <div id="player">
        <YouTube
          videoId={videos[count]}
          opts={opts}
          onReady={onReady}
          onEnd={onEnd}
        />
      </div>
    );
  };
  const Main = () => {
    return (
      <React.Fragment>
        <div className="initialPageContentText">nsutRADIO</div>
        <Player />
        <div
          className="mainPageAudioTitle"
          style={{
            color: "white",
            height: "16px",
            boxSizing: "border-box",
            width: "200px",
            overflowX: "scroll",
            overflowY: "hidden",
            whiteSpace: "nowrap",
          }}
        >
          <div className="audioTitle">{audioTitle}</div>
        </div>
      </React.Fragment>
    );
  };
  return (
    <div className="initialPageMainContainer">
      <div className="initialPageContentContainer">
        <div className="initialPageContent">
          <div className="initialPageContentBorder">
            <Main />
          </div>
        </div>
      </div>
    </div>
  );
};

export default MainPage;
