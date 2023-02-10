import React from "react";
import "../styles/playlist.css";
import moment from "moment";
import YTSearch from "youtube-api-search";

const Playlist = ({ socket }) => {
  const [page, setPage] = React.useState(false);

  const PlaylistBtn = ({ stateChanger }) => {
    return (
      <div className="playlistBtnContainer">
        <div
          className="playlistBtn"
          onClick={() => {
            stateChanger(true);
          }}
        >
          <div className="playlistBtnIcon"></div>
          Playlist
        </div>
      </div>
    );
  };
  const PlaylistContent = ({ stateChanger }) => {
    const Input = ({ stateChanger }) => {
      const [nameStored, setNameStored] = React.useState("");
      const [song, setSong] = React.useState("");

      React.useEffect(() => {
        console.log("useEffect running");
        const nameCheck = localStorage.getItem("name");
        if (nameCheck) {
          setNameStored(nameCheck);
        }
      }, []);

      const sendSong = React.useCallback(async () => {
        var videoId = "";
        const videoSearch = (term) => {
          YTSearch(
            { key: "AIzaSyBq9Vj9JGZ2gO8CYujvXYaxOIsJUlZZVuU", term: term },
            async (videos) => {
              console.log(videos);
              videoId = videos[0].id.videoId;
              console.log(videoId);
              const response = await fetch(
                `https://www.googleapis.com/youtube/v3/videos?part=contentDetails&id=${videoId}&key=AIzaSyBq9Vj9JGZ2gO8CYujvXYaxOIsJUlZZVuU`
              );
              const response2 = await fetch(
                `https://www.googleapis.com/youtube/v3/videos?part=snippet&id=${videoId}&key=AIzaSyBq9Vj9JGZ2gO8CYujvXYaxOIsJUlZZVuU`
              );
              const data2 = await response2.json();
              const data = await response.json();
              const title = data2.items[0].snippet.title;
              const duration = data.items[0].contentDetails.duration;
              const durationInSeconds = moment.duration(duration).asSeconds();
              var form = [nameStored, videoId, durationInSeconds, title];
              socket.emit("send_song", form);
              setSong("");
            }
          );
        };
        if (!song) return;
        videoSearch(song);
        console.log(videoId);
        // const response = await fetch(
        //   `https://www.googleapis.com/youtube/v3/videos?part=contentDetails&id=${videoId}&key=AIzaSyBq9Vj9JGZ2gO8CYujvXYaxOIsJUlZZVuU`
        // );
        // const data = await response.json();
        // const duration = data.items[0].contentDetails.duration;
        // const durationInSeconds = moment.duration(duration).asSeconds();
        // var form = [nameStored, videoId, durationInSeconds];
        // socket.emit("send_song", form);
        // setSong("");
      }, [nameStored, song]);

      React.useEffect(() => {
        if (nameStored) {
          document.getElementsByClassName("playlistInput")[0].onkeydown =
            function (e) {
              if (e.keyCode === 13) {
                sendSong();
              }
            };
        }
      }, [sendSong, nameStored]);

      return (
        <div className="playlistInputContainer">
          <div
            className="playlistCloseIcon"
            onClick={() => stateChanger(false)}
          ></div>
          <input
            type="text"
            className="playlistInput"
            value={song}
            placeholder="Add Song"
            onChange={(e) => {
              setSong(e.target.value);
            }}
          />
        </div>
      );
    };

    const PlaylistContentFinal = () => {
      const [playlist, setPlaylist] = React.useState([]);
      React.useEffect(() => {
        socket.emit("playlist");
      }, []);

      // React.useEffect(() => {
      //   const fetchPlaylist = async () => {
      //     const response = await fetch(
      //       `${process.env.REACT_APP_SOCKET_URL}/api/playlist`
      //     );
      //     const data = await response.json();
      //     setPlaylist(data);
      //     console.log(data);
      //   };
      //   fetchPlaylist();
      // }, []);
      React.useEffect(() => {
        socket.on("playlist_update", (data) => {
          console.log(data);
          setPlaylist(data);
          socket.off("playlist_update");
        });
      }, [playlist]);

      socket.on("fetch_ping", (data) => {
        const data2 = Date.now();
        console.log(data2 - data);
        socket.off("fetch_ping");
      });

      try {
        return (
          <div className="playlistContentContainer">
            {playlist.map((item, index) => {
              return (
                <div className="playlistItemContainer" key={item._id}>
                  <div className="playlistItem">
                    <div className="playlistItemTitle" id={`index${index}`}>
                      {index + 1}. {item.title}
                    </div>
                    <div className="playlistItemName">By {item.name}</div>
                  </div>
                </div>
              );
            })}
          </div>
        );
      } catch (error) {
        console.log(error);
      }
      return <div className="playlistContentContainer"></div>;
    };

    return (
      <React.Fragment>
        {/* <Content/> */}
        <PlaylistContentFinal />
        <Input stateChanger={stateChanger} />
        <div className="infoIcon">
          <div className="infoIconText">
            Enter the "title" of the song to add it in playlist. For more
            accurate results, add the artist name as well.
          </div>
        </div>
        {/* <div className="playlistInputContainer">
          <div
            className="playlistCloseIcon"
            onClick={() => stateChanger(false)}
          ></div>
          <input
            type="text"
            className="playlistInput"
            value={song}
            placeholder="Add Song"
            onChange={(e) => {
              setSong(e.target.value);
            }}
          />
        </div> */}
      </React.Fragment>
    );
  };
  return (
    <div className="mainPlaylistContainer">
      {page ? (
        <PlaylistContent stateChanger={setPage} />
      ) : (
        <PlaylistBtn stateChanger={setPage} />
      )}
    </div>
  );
};

export default Playlist;
