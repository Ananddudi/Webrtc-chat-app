import { io } from "socket.io-client";

const URL = `/app`;

export const socket = io(URL, {
  autoConnect: false,
  withCredentials: true,
  transports: ["websocket"],
});
