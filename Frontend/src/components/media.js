import React, { useState } from "react";
import { ReactComponent as Video } from "../statics/videIcon.svg";
import { ReactComponent as Mp3 } from "../statics/mp3file.svg";
import { ReactComponent as ImageIcon } from "../statics/imageIcon.svg";
import { socket } from "../services/socket";

const Media = ({ recieverMail, convId }) => {
  const [show, setShow] = useState(false);

  const handleChange = (e) => {
    e.preventDefault();
    const file = e.target.files[0];
    const reader = new FileReader();

    reader.onload = () => {
      console.log("file", file);
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
      <ul className={`media-items ${show && "show"}`}>
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
