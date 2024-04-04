import { io } from "socket.io-client";

const URL = `${process.env.REACT_APP_NODE_BACKEND_URL}/app`;

export const socket = io(URL, {
  autoConnect: false,
  withCredentials: true,
});
