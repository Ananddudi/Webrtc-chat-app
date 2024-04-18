import { io } from "socket.io-client";
import axiosapi from "./api";

const URL = `${process.env.REACT_APP_NODE_BACKEND_URL}/app`;

export const socket = io(URL, {
  autoConnect: false,
  withCredentials: true,
});

export function rtchandshake(type, reciever, data = null) {
  try {
    switch (type) {
      case "init":
        socket.emit("initiate-handshake", { data, reciever });
        break;
      case "accepted":
        socket.emit("handshake-accepted", { data, reciever });
        break;
      case "addIce":
        socket.emit("add-ice-candidate", { data, reciever });
        break;
      case "addOffer":
        socket.emit("add-remote-offer", { data, reciever });
        break;
      case "closeRtc":
        socket.emit("close-rtc", { data, reciever });
        break;
    }
  } catch (error) {
    axiosapi.error(error.message);
  }
}
