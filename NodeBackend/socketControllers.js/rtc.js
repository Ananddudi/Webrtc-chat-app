const { formatter } = require("../error");
// const { parsetoken } = require("../utils/parseToken");
// const parseCookie = require("../utils/parseCookie");

const handleConnection = (socket, onlineUsers) => {
  socket.on("initiate-handshake", async ({ reciever, data }) => {
    try {
      // const token = parseCookie(socket.request); // For cookie based authentication you can use these
      // const sender = parsetoken(token);
      const user = onlineUsers.findByUsername(reciever);
      socket.to(user.id).emit("handshake-request", { data });
    } catch (error) {
      console.log("error in initiate-connection", error.message);
      formatter.ErrorHandling(socket, error);
    }
  });

  socket.on("handshake-reject", async ({ reciever }) => {
    try {
      const user = onlineUsers.findByUsername(reciever);
      socket.to(user.id).emit("handshake-response", "reject");
    } catch (error) {
      console.log("error in initiate-connection", error.message);
      formatter.ErrorHandling(socket, error);
    }
  });

  socket.on("handshake-accepted", async ({ reciever }) => {
    try {
      const user = onlineUsers.findByUsername(reciever);
      socket.to(user.id).emit("handshake-response", "accept");
    } catch (error) {
      console.log("error in initiate-connection", error.message);
      formatter.ErrorHandling(socket, error);
    }
  });

  socket.on("add-ice-candidate", async ({ data, reciever }) => {
    try {
      const user = onlineUsers.findByUsername(reciever);
      socket.to(user.id).emit("recieve-ice-candidate", { iceCandidate: data });
    } catch (error) {
      console.log("error in add-ice-candidate", error.message);
      formatter.ErrorHandling(socket, error);
    }
  });

  socket.on("add-remote-offer", async ({ reciever, data }) => {
    try {
      const user = onlineUsers.findByUsername(reciever);
      socket.to(user.id).emit("recieve-remote-offer", { offer: data });
    } catch (error) {
      console.log("error in add-offer", error.message);
      formatter.ErrorHandling(socket, error);
    }
  });

  socket.on("close-rtc", async ({ reciever }) => {
    try {
      const user = onlineUsers.findByUsername(reciever);
      if (!user.id) return;
      socket.to(user.id).emit("close-rtc-request");
    } catch (error) {
      console.log("error in close-connection", error.message);
      formatter.ErrorHandling(socket, error);
    }
  });
};

module.exports = { handleConnection };
