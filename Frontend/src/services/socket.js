import { io } from "socket.io-client";
import axiosapi from "./api";

const URL = `${process.env.REACT_APP_NODE_BACKEND_URL}/app`;

export const socket = io(URL, {
  autoConnect: false,
  withCredentials: true,
});

export function rtchandshake(type, reciever, data = null) {
  try {
    let event = "";
    switch (type) {
      case "init":
        event = "initiate-handshake";
        break;
      case "accepted":
        event = "handshake-accepted";
        break;
      case "addIce":
        event = "add-ice-candidate";
        break;
      case "addOffer":
        event = "add-remote-offer";
        break;
      case "closeRtc":
        event = "close-rtc";
        break;
      case "rtcReject":
        event = "handshake-reject";
        break;
    }
    socket.emit(event, { data, reciever });
  } catch (error) {
    axiosapi.error(error.message);
  }
}
