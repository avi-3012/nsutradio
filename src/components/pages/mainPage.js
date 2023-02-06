import React from "react";
import "../styles/MainPage.css";
import "../styles/playlist.css";
import YouTube from "react-youtube";

const MainPage = ({ stateChanger, socket }) => {
  const [update, setUpdate] = React.useState(false);

  socket.on("update_song", () => {
    setUpdate(!update);
  });

  const Player = () => {
    console.log("Entering Player");
    const [seekPosition] = React.useState(0);
    const [playing, setPlaying] = React.useState(false);
    const [playlist, setPlaylist] = React.useState("");
    // const [audioTitle, setAudioTitle] = React.useState("Nothing Playing");

    React.useEffect(() => {
      console.log("Entering useEffect");

      const fetchSong = async () => {
        console.log("Entering fetchSong");
        const response = await fetch(
          `${process.env.REACT_APP_SOCKET_URL}/api/song`
        );
        const playlist = await response.text();

        setPlaylist(playlist);

        console.log("Exiting fetchSong", playlist);
      };

      if (!playing) {
        console.log("Entering useEffect if");
        fetchSong();
        console.log("Exiting useEffect if");
      }
      console.log("Exiting useEffect");
    }, [playing]);

    // React.useEffect(() => {
    //   if (playlist) {
    //     const fetchData = async () => {
    //       console.log("Entering fetchData");
    //       const response = await fetch(
    //         `https://www.googleapis.com/youtube/v3/videos?part=snippet&id=${playlist}&key=AIzaSyBq9Vj9JGZ2gO8CYujvXYaxOIsJUlZZVuU`
    //       );
    //       const data = await response.json();
    //       console.log("Setting audio title");
    //       setAudioTitle(data.items[0].snippet.title);
    //       console.log("Exiting fetchData");
    //     };
    //     fetchData();
    //   }
    // }, [playlist]);

    const opts = {
      height: "200",
      width: "400",
      playerVars: {
        // https://developers.google.com/youtube/player_parameters
        autoplay: 1,
        disablekb: 1,
        controls: 0,
      },
    };
    const onEnd = () => {
      console.log("Entering onEnd");
      setPlaying(false);
      setUpdate(!update);
      console.log("Exiting onEnd");
    };
    const onReady = (event) => {
      event.target.seekTo(seekPosition);
    };

    const Playing = () => {
      const [audioTitle, setAudioTitle] = React.useState("Nothing Playing");

      React.useEffect(() => {
        if (playlist) {
          const fetchData = async () => {
            console.log("Entering fetchData");
            const response = await fetch(
              `https://www.googleapis.com/youtube/v3/videos?part=snippet&id=${playlist}&key=AIzaSyBq9Vj9JGZ2gO8CYujvXYaxOIsJUlZZVuU`
            );
            const data = await response.json();
            console.log("Setting audio title");
            setAudioTitle(data.items[0].snippet.title);
            console.log("Exiting fetchData");
          };
          fetchData();
        }
      }, []);
      return (
        <React.Fragment>
          <div className="nowPlaying">Now Playing</div>
          <div
            className="mainPageAudioTitle"
            style={{
              color: "white",
              height: "20px",
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
      <React.Fragment>
        <div id="player">
          <YouTube
            videoId={playlist}
            opts={opts}
            onReady={onReady}
            onEnd={onEnd}
            onPlay={() => setPlaying(true)}
          />
        </div>
        <Playing />
        {/* <div className="nowPlaying">Now Playing</div>
        <div
          className="mainPageAudioTitle"
          style={{
            color: "white",
            height: "20px",
            boxSizing: "border-box",
            width: "200px",
            overflowX: "scroll",
            overflowY: "hidden",
            whiteSpace: "nowrap",
          }}
        >
          <div className="audioTitle">{audioTitle}</div>
        </div> */}
      </React.Fragment>
    );
  };
  const Main = () => {
    const handleLeaveClick = () => {
      stateChanger(false);
    };
    return (
      <React.Fragment>
        <div className="initialPageContentText">nsutRADIO</div>
        <Player />
        {/* <div className="nowPlaying">Now Playing</div>
        <div
          className="mainPageAudioTitle"
          style={{
            color: "white",
            height: "20px",
            boxSizing: "border-box",
            width: "200px",
            overflowX: "scroll",
            overflowY: "hidden",
            whiteSpace: "nowrap",
          }}
        >
          <div className="audioTitle">{audioTitle}</div>
        </div> */}
        <div className="Leave" onClick={handleLeaveClick}>
          Leave
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
