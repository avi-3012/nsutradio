import React from "react";
import "../styles/playlist.css";

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
    const [nameStored, setNameStored] = React.useState("");
    const [song, setSong] = React.useState("");

    React.useEffect(() => {
      console.log("useEffect running");
      const nameCheck = localStorage.getItem("name");
      if (nameCheck) {
        setNameStored(nameCheck);
      }
    }, []);

    const sendSong = React.useCallback(() => {
      var data = [nameStored, song];
      socket.emit("send_song", data);
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
      //   if (!nameStored) {
      //     document.getElementsByClassName("chatRoomInitialInput")[0].onkeydown =
      //       function (e) {
      //         if (e.keyCode === 13) {
      //         }
      //       };
      //   }
    }, [sendSong, nameStored]);

    return (
      <React.Fragment>
        <div className="playlistContentContainer"></div>
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
