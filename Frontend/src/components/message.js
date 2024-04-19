import React, { useEffect, useRef, useState } from "react";
import "./message.css";
import { time_formate } from "../utils/dateFormate";
import { socket } from "../services/socket";
import Media from "./media";
import LoadingBar from "react-top-loading-bar";

const Message = ({ messages, convId, data, addMessage }) => {
  const [progress, setProgress] = useState(0);
  const viewRef = useRef(null);
  const handleSubmit = (e) => {
    if (e.key === "Enter") {
      e.preventDefault();
      socket.emit("send-message", convId, data.email, e.target.value);
      e.target.value = "";
    }
  };

  const renderTextOrMedia = (msg) => {
    let componentToRender;
    switch (msg.type) {
      case "audio":
        componentToRender = (
          <audio controls className="audioMessage">
            <source src={msg.message} type="audio/mpeg" />
            Your browser does not support the audio element.
          </audio>
        );
        break;
      case "video":
        componentToRender = (
          <video controls className="videoMessage">
            <source src={msg.message} type="video/mp4" />
            Your browser does not support the video element.
          </video>
        );
        break;
      case "image":
        componentToRender = (
          <img src={msg.message} alt={msg.message} className="imageMessage" />
        );
        break;
      default:
        componentToRender = msg.message;
        break;
    }
    return componentToRender;
  };

  useEffect(() => {
    const handleMessage = (messageObj) => {
      addMessage(messageObj);
    };
    socket.on("recieve-message", handleMessage);
    return () => {
      socket.off("recieve-message", handleMessage);
    };
  }, []);

  useEffect(() => {
    if (viewRef?.current) {
      viewRef.current.scrollTop = viewRef.current.scrollHeight;
    }
    // viewRef?.current?.scrollIntoView({
    //   behavior: "smooth",
    //   block: "end",
    // });
  }, [messages]);

  return (
    <section className="message-section">
      <LoadingBar
        color="#f11946"
        progress={progress}
        onLoaderFinished={() => setProgress(0)}
      />
      <div className="messages" ref={viewRef}>
        {messages.map((msg, index) => {
          return (
            <div
              key={index}
              className={`${msg.position === "L" ? "left" : "right"}`}
            >
              <article>
                <div>
                  <article>{renderTextOrMedia(msg)}</article>
                  <article>{time_formate(msg.createdAt)}</article>
                </div>
              </article>
            </div>
          );
        })}
      </div>
      <div className="textarea-mediaItems">
        <textarea
          // value={textValue}
          // onChange={handleTextChange}
          name="sendmessage"
          onKeyDown={handleSubmit}
          rows={1}
          placeholder="Type message"
          id="msg-box"
          className="messageInboxes"
        />
        <Media
          recieverMail={data.email}
          convId={convId}
          setProgress={setProgress}
        />
      </div>
    </section>
  );
};

export default Message;
