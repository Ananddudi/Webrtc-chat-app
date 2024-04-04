import React, { useEffect, useRef } from "react";
import "./message.css";
import { time_formate } from "../services/dateFormate";
import { socket } from "../services/socket";

const Message = ({ messages, convId, data, addMessage }) => {
  const viewRef = useRef(null);
  const handleSubmit = (e) => {
    if (e.key == "Enter") {
      e.preventDefault();
      socket.emit("send-message", convId, data.email, e.target.value);
      e.target.value = "";
    }
  };

  //   {
  // }
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
    viewRef?.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  return (
    <section className="message-section">
      <div className="messages">
        {messages.map((msg) => {
          return (
            <div
              ref={viewRef}
              className={`${msg.position == "L" ? "left" : "right"}`}
            >
              <article>
                <div>
                  <article>{msg.message}</article>
                  <article>{time_formate(msg.createdAt)}</article>
                </div>
              </article>
            </div>
          );
        })}
      </div>
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
    </section>
  );
};

export default Message;
