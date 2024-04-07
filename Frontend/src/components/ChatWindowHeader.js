import React, { useEffect } from "react";
import "./chatwindow.css";
import { IoArrowBack } from "react-icons/io5";
import { socket } from "../services/socket";
import Golive from "../statics/goLive.svg";

const ChatWindowHeader = ({ item, setSwitched, setGoLive }) => {
  const imageurl = item.profilepic
    ? item.profilepic
    : require("../statics/profileImage.jpg");

  useEffect(() => {
    // console.log("item", item);
    const userOnline = (email) => {
      if (item.email === email) {
        item.available = "y";
      }
    };
    const userOffline = (email) => {
      if (item.email === email) {
        item.available = "n";
      }
    };
    socket.on("online-status", userOnline);
    socket.on("offline-status", userOffline);
    return () => {
      socket.off("online-status", userOnline);
      socket.off("offline-status", userOffline);
    };
  }, []);

  return (
    <div className="chat-list-header">
      <div className="button-parent">
        <button className="btn" onClick={() => setSwitched(true)}>
          <IoArrowBack className="icons" />
        </button>
      </div>
      <section className="profile-info-video">
        <div className="profile-info">
          <img src={imageurl} alt={item._id} />
          <div className="info">
            <div>{item.fullname}</div>
            <div className={item.available === "y" ? "" : "hide"}>
              {item.available === "y" ? "Online" : "Offline"}
            </div>
          </div>
        </div>
        <div className="live-video-icon">
          <img
            src={Golive}
            alt="go-live-alt"
            className="go-live"
            onClick={() => setGoLive(true)}
          />
        </div>
      </section>
    </div>
  );
};

export default ChatWindowHeader;
