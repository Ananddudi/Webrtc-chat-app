import React, { useState } from "react";
import { ReactComponent as Video } from "../statics/videIcon.svg";
import { ReactComponent as Mp3 } from "../statics/mp3file.svg";
import { ReactComponent as ImageIcon } from "../statics/imageIcon.svg";
import { socket } from "../services/socket";
import axiosapi from "../services/api";

const Media = ({ recieverMail, convId }) => {
  const [show, setShow] = useState(false);
  const [disable, setDisable] = useState(false);

  const handleChange = (e) => {
    e.preventDefault();
    if (disable) {
      e.target.value = "";
      axiosapi.error("Please wait while file being sent!", "", 4);
      return;
    }
    setDisable(true);
    const file = e.target.files[0];
    if (!file) {
      e.target.value = "";
      axiosapi.success("No file selected!", "", 4);
      return;
    }

    console.log("file ", file);
    const reader = new FileReader();

    reader.onload = () => {
      console.log("reader.result", reader.result);
      const base64Data = reader.result.split(",")[1];
      const chunkSize = 1024;
      const totalChunks = Math.ceil(base64Data.length / chunkSize);
      let i = 0;

      const sendChunk = () => {
        const start = i * chunkSize;
        const end = Math.min((i + 1) * chunkSize, base64Data.length);

        socket.emit("read-stream", base64Data.slice(start, end), () => {
          i++;
          if (i < totalChunks) {
            sendChunk();
          } else {
            socket.emit(
              "stream-completion",
              file.name,
              file.type,
              convId,
              recieverMail
            );
            e.target.value = null;
            setDisable(false);
            setShow(!show);
          }
        });
      };

      sendChunk();
    };

    reader.readAsDataURL(file);
  };

  return (
    <button className="media">
      <div onClick={() => setShow(!show)}>Media</div>
      <ul className={`media-items ${show ? "show" : ""}`}>
        <li>
          <label htmlFor="video">
            <Video className="icons" />
            <input
              type="file"
              name="video"
              id="video"
              accept="video/*"
              onChange={handleChange}
            />
          </label>
        </li>
        <li>
          <label htmlFor="mp3">
            <Mp3 className="icons" />
            <input
              type="file"
              name="mp3"
              id="mp3"
              accept=".mp3,audio/*"
              onChange={handleChange}
            />
          </label>
        </li>
        <li>
          <label htmlFor="image">
            <ImageIcon className="icons" />
            <input
              type="file"
              name="image"
              id="image"
              accept="image/png, image/jpeg"
              onChange={handleChange}
            />
          </label>
        </li>
      </ul>
    </button>
  );
};

export default Media;
