import React, { useEffect, useState } from "react";
import "./chatlist.css";
import AddingUser from "./addingUser";
import { useContenctHook } from "../context/contextapi";
import { socket } from "../services/socket";
import { d_formate } from "../services/dateFormate";

const ListItem = ({ item }) => {
  const [lstMessage, setLstmessage] = useState("No chat");
  const { auth } = useContenctHook();
  const [invoked, setInvoked] = useState(false);
  const imageurl = item.profilepic
    ? item.profilepic
    : require("../statics/profileImage.jpg");

  useEffect(() => {
    const handleConv = (conversation) => {
      if (conversation && conversation.LastMessage) {
        setLstmessage(conversation.LastMessage.message);
      }
    };

    const hightlightHandle = () => {
      setInvoked(true);
    };

    if (auth) {
      socket.emit("get-last-message", item.email, item._id);
    }
    socket.on(`last-message-${item.email}`, handleConv);
    socket.on(`highlight ${item.email}`, hightlightHandle);
    return () => {
      socket.off(`last-message-${item.email}`, handleConv);
      socket.off(`highlight ${item.email}`, hightlightHandle);
    };
  }, [auth, item]);

  return (
    <section className="chat-info">
      <section className="chat-info-two">
        <div>
          <span
            id={
              item.available === "y"
                ? "image-online-icon-show"
                : "image-online-icon-show-not-show"
            }
          ></span>
          <img src={imageurl} alt={item._id} />
        </div>
        <div className="name-message">
          <div>{item.fullname}</div>
          <div className={invoked ? "highlight" : ""}>{lstMessage}</div>
        </div>
      </section>
      <div>{d_formate(item.createdAt)}</div>
    </section>
  );
};

//dynamically importing images
const Chatlist = ({ handleListData }) => {
  const { filteredList } = useContenctHook();

  return (
    <div className="chat-list-container">
      {filteredList.map((item) => (
        <article
          key={item._id}
          className="chat-item"
          onClick={() => handleListData(item)}
        >
          <ListItem item={item} />
        </article>
      ))}
      <AddingUser />
    </div>
  );
};

export default Chatlist;
