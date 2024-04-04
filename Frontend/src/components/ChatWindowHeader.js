import React from "react";
import "./chatwindow.css";
import { IoArrowBack } from "react-icons/io5";

const ChatWindowHeader = ({ item, setSwitched }) => {
  const imageurl = item.profilepic
    ? item.profilepic
    : require("../statics/profileImage.jpg");
  return (
    <div className="chat-list-header">
      <img src={imageurl} alt={item._id} />
      <div className="info">
        <div>{item.fullname}</div>
        <div className={item.available === "y" ? "" : "hide"}>
          {item.available == "y" ? "Online" : "Offline"}
        </div>
      </div>
      <div className="button-parent">
        <button className="btn" onClick={() => setSwitched(true)}>
          <IoArrowBack className="icons" />
        </button>
      </div>
    </div>
  );
};

export default ChatWindowHeader;
