import React, { useEffect, useState } from "react";
import profileImage from "../statics/profileImage.jpg";
import { MdCallEnd } from "react-icons/md";
import { rtchandshake, socket } from "../services/socket";
import { useContenctHook } from "../context/contextapi";
import { IoCall } from "react-icons/io5";
import CallerWebRTC from "../components/callerRtc";
import AnsererWebRTC from "../components/answerRtc";
import axiosapi from "../services/api";

const WebRtcHandshake = () => {
  const { rtcAnswereData, setRtcAnswereData } = useContenctHook();
  const [answererData, setAnswererData] = useState(null);
  const [showRtc, setShowRtc] = useState("");

  const answererResponse = () => {
    try {
      setShowRtc("answerer");
      rtchandshake("accepted", answererData.email);
    } catch (error) {
      axiosapi.error(error.message);
    }
  };

  const closeRtc = (reciever) => {
    try {
      setRtcAnswereData(null);
      setAnswererData(null);
      setShowRtc("");
      rtchandshake("closeRtc", reciever);
    } catch (error) {
      axiosapi.error(error.message);
    }
  };

  useEffect(() => {
    const handshakeResponse = (params) => {
      if (params == "accept") {
        setShowRtc("caller");
      } else {
        setRtcAnswereData(null);
        setAnswererData(null);
        setShowRtc("");
        axiosapi.error("User is already on other call");
      }
    };
    const handleClosingRtc = (email = null) => {
      if (email && (rtcAnswereData || answererData)) {
        axiosapi.success(`${email} has disconnected the call!`);
      } else {
        if (rtcAnswereData) {
          axiosapi.success(
            `${
              rtcAnswereData?.fullname ? rtcAnswereData?.fullname : "Other user"
            } has disconnected the call!`
          );
        }
        if (answererData) {
          axiosapi.success(
            `${
              answererData?.fullname ? answererData?.fullname : "Other user"
            } has disconnected the call!`
          );
        }
      }
      closeRtc();
    };

    socket.on("handshake-response", handshakeResponse);
    socket.on("close-rtc-request", handleClosingRtc);
    socket.on("offline-status", handleClosingRtc);
    //answere
    const handshakeRequest = ({ data }) => {
      if (answererData || rtcAnswereData) {
        rtchandshake("rtcReject", data.email);
        return;
      }
      setAnswererData(data);
    };
    socket.on("handshake-request", handshakeRequest);
    return () => {
      socket.off("handshake-request", handshakeRequest);
      socket.off("offline-status", handleClosingRtc);
      socket.off("close-rtc-request", handleClosingRtc);
      socket.off("handshake-response", handshakeResponse);
    };
  }, [showRtc]);

  const handleShowCall = () => {
    if (rtcAnswereData !== null) {
      return (
        <section className="call-info">
          <div className="image-name">
            <img
              src={
                rtcAnswereData?.profilepic
                  ? rtcAnswereData?.profilepic
                  : profileImage
              }
              alt="profileImage-caller"
              className="caller-profile-img"
            />
            <div className="caller-name">
              {rtcAnswereData?.fullname ? rtcAnswereData?.fullname : "Unknown"}
            </div>
          </div>
          <div className="response-btn">
            <button
              className="drop-btn"
              onClick={() => closeRtc(rtcAnswereData.email)}
            >
              <MdCallEnd className="icon" />
            </button>
          </div>
        </section>
      );
    }

    return (
      <section className="call-info">
        <div className="image-name">
          <img
            src={
              answererData?.profilepic ? answererData?.profilepic : profileImage
            }
            alt="profileImage-caller"
            className="caller-profile-img"
          />
          <div className="caller-name">
            {answererData?.fullname ? answererData?.fullname : "Unknown"}
          </div>
        </div>
        <div className="response-btn">
          <button className="pick-btn" onClick={answererResponse}>
            <IoCall className="icon" />
          </button>
          <button
            className="drop-btn"
            onClick={() => closeRtc(answererData.email)}
          >
            <MdCallEnd className="icon" />
          </button>
        </div>
      </section>
    );
  };

  return (
    <div
      className={`live-video-page ${
        rtcAnswereData || answererData ? "show" : ""
      }`}
    >
      {showRtc == "" && handleShowCall()}
      {showRtc === "caller" && (
        <CallerWebRTC reciever={rtcAnswereData.email} closeRtc={closeRtc} />
      )}
      {showRtc === "answerer" && (
        <AnsererWebRTC reciever={answererData.email} closeRtc={closeRtc} />
      )}
    </div>
  );
};

export default WebRtcHandshake;
