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
    const [seeking, setSeeking] = React.useState(false);
    const [seekPosition, setPosition] = React.useState(0);
    const [playing, setPlaying] = React.useState(false);
    const [playlist, setPlaylist] = React.useState("");
    // const [audioTitle, setAudioTitle] = React.useState("Nothing Playing");

    // React.useEffect(() => {
    //   console.log("Entering useEffect");

    //   const fetchSong = async () => {
    //     console.log("Entering fetchSong");
    //     const response = await fetch(
    //       `${process.env.REACT_APP_SOCKET_URL}/api/song`
    //     );
    //     const data = await response.json();
    //     setPosition(data.position);
    //     setPlaylist(data.song);

    //     console.log("Exiting fetchSong", data.song + " " + data.position);
    //   };

    //   if (!playing) {
    //     console.log("Entering useEffect if");
    //     fetchSong();
    //     console.log("Exiting useEffect if");
    //   }
    //   console.log("Exiting useEffect");
    // }, [playing]);
    React.useEffect(() => {
      socket.on("fetch_song", (data) => {
        console.log("Entering fetch_song", data);
        setPlaylist(data);
        socket.off("fetch_song");
      });
      socket.on("fetch_position", (data) => {
        setPosition(data);
        socket.off("fetch_position");
      });
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
        controls: 1,
      },
    };
    const onEnd = () => {
      console.log("Entering onEnd");
      setPlaying(false);
      console.log("Exiting onEnd");
    };
    const onPlay = (event) => {
      // event.target.pauseVideo();
      setPlaying(true);
      if (seeking) {
        return;
      }
      setSeeking(true);
      console.log("Entering onReady");
      // event.target.playVideo();
      event.target.seekTo(seekPosition, () => {
        // event.target.playVideo();
        setSeeking(false);
      });
      console.log("Seeking to: ", seekPosition);
      console.log("Exiting onReady");
    };
    const onPause = (event) => {
      event.target.playVideo();
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

    // const Ping = () => {
    //   const [ping, setPing] = React.useState(0);
    //   socket.on("fetch_ping", (data) => {
    //     const data2 = Date.now();
    //     setPing(data2 - data);
    //     console.log("Ping: ", data2 - data);
    //   });
    //   return (
    //     <React.Fragment>
    //       <div className="ping">
    //         <div className="pingIcon"></div>
    //         {ping}
    //       </div>
    //     </React.Fragment>
    //   );
    // };

    return (
      <React.Fragment>
        <div id="player">
          <YouTube
            videoId={playlist}
            opts={opts}
            onPlay={onPlay}
            onEnd={onEnd}
            onPause={onPause}
            // onPlay={() => setPlaying(true)}
          />
        </div>
        <Playing />
        {/* <Ping /> */}
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
    const Ping = () => {
      const [ping, setPing] = React.useState(0);
      const [users, setUsers] = React.useState(0);
      socket.on("fetch_ping", (data) => {
        const data2 = Date.now();
        setPing(Math.abs(data2 - data[0]));
        setUsers(data[1]);
        console.log("Ping: ", Math.abs(data2 - data[0]));
        socket.off("fetch_ping");
      });
      return (
        <React.Fragment>
          <div
            style={{
              display: "flex",
              flexDirection: "row-reverse",
              justifyContent: "space-between",
              width: "120px",
            }}
          >
            <div className="users">
              <div className="usersIcon"></div>
              {users}
            </div>
            <div className="ping">
              <div className="pingIcon"></div>
              {ping}
            </div>
          </div>
        </React.Fragment>
      );
    };
    const handleLeaveClick = () => {
      stateChanger(false);
    };
    return (
      <React.Fragment>
        <div className="initialPageContentText">nsutRADIO</div>
        <Player />
        <Ping />
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
