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
            (videos) => {
              console.log(videos);
              videoId = videos[0].id.videoId;
              console.log(videoId);
            }
          );
        };
        if (!song) return;
        videoSearch(song);
        const response = await fetch(
          `https://www.googleapis.com/youtube/v3/videos?part=contentDetails&id=${videoId}&key=AIzaSyBq9Vj9JGZ2gO8CYujvXYaxOIsJUlZZVuU`
        );
        const data = await response.json();
        const duration = data.items[0].contentDetails.duration;
        const durationInSeconds = moment.duration(duration).asSeconds();
        var form = [nameStored, videoId, durationInSeconds];
        socket.emit("send_song", form);
        setSong("");
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

    return (
      <React.Fragment>
        {/* <Content/> */}
        <div className="playlistContentContainer"></div>
        <Input stateChanger={stateChanger} />
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
