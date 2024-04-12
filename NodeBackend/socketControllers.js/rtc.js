const { formatter } = require("../error");
const { parsetoken } = require("../utils/parseToken");
const parseCookie = require("../utils/parseCookie");

const handleConnection = (socket, onlineUsers) => {
  socket.on("initiate-connection", async ({ reciever, sendTo }) => {
    try {
      // const token = parseCookie(socket.request); // For cookie based authentication you can use these
      // const sender = parsetoken(token);
      const user = onlineUsers.findByUsername(sendTo);
      socket.to(user.id).emit("connection-request", { reciever });
    } catch (error) {
      console.log("error in initiate-connection", error.message);
      formatter.ErrorHandling(socket, error);
    }
  });

  socket.on("connection-accepted", async ({ reciever }) => {
    try {
      const user = onlineUsers.findByUsername(reciever);
      socket.to(user.id).emit("connection-status");
    } catch (error) {
      console.log("error in initiate-connection", error.message);
      formatter.ErrorHandling(socket, error);
    }
  });

  socket.on("close-connection", async ({ reciever }) => {
    try {
      const user = onlineUsers.findByUsername(reciever);
      socket.to(user.id).emit("close-connection-request");
    } catch (error) {
      console.log("error in close-connection", error.message);
      formatter.ErrorHandling(socket, error);
    }
  });

  socket.on("add-offer", async ({ sender, reciever, offer }) => {
    try {
      const user = onlineUsers.findByUsername(reciever);
      socket.to(user.id).emit("recieve-offer", { sender, reciever, offer });
    } catch (error) {
      console.log("error in add-offer", error.message);
      formatter.ErrorHandling(socket, error);
    }
  });

  socket.on("add-ice-candidate", async ({ sender, reciever, iceCandidate }) => {
    try {
      const user = onlineUsers.findByUsername(reciever);
      socket.to(user.id).emit("recieve-ice-candidate", { iceCandidate });
    } catch (error) {
      console.log("error in add-ice-candidate", error.message);
      formatter.ErrorHandling(socket, error);
    }
  });
};

module.exports = { handleConnection };
