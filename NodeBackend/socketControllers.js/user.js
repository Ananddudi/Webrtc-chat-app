const { createMessageInSocket } = require("../controllers/message");
const { formatter } = require("../error");
const { parsetoken } = require("../utils/parseToken");
const parseCookie = require("../utils/parseCookie");
const { updateAndGetList } = require("../controllers/user");
const conversationModel = require("../models/conversation");

const connect = async (io, socket, onlineUsers) => {
  try {
    const token = parseCookie(socket.request);
    const rg_user = parsetoken(token);
    const exist = onlineUsers.addUser(socket.id, rg_user.email);

    if (exist == "exist") {
      socket.emit("exist", true);
      return;
    }

    socket.emit("exist", false); //checks for same user connection more than one time
    const list = await updateAndGetList(rg_user.email, "y");
    io.emit("onlineUsers", list);
    socket.broadcast.emit("online-status", rg_user.email);
  } catch (error) {
    console.log("error in connect", error.message);
    formatter.ErrorHandling(socket, error);
  }
};

const disconnect = (io, socket, onlineUsers) => {
  socket.on("disconnect", async () => {
    try {
      console.log("socket is disconnected", socket.id);
      const user = onlineUsers.removeUser(socket.id);
      if (user == null) {
        return;
      }
      const list = await updateAndGetList(user.username, "n");
      io.emit("onlineUsers", list);
      socket.broadcast.emit("offline-status", user.username);
    } catch (error) {
      console.log("error in disconnect", error.message);
      formatter.ErrorHandling(socket, error);
    }
  });
};

const getUsersWithPagination = async (socket) => {
  socket.on("get-users", async (page, limit) => {
    try {
      const list = await updateAndGetList(undefined, undefined, page, limit);
      socket.emit("add-users", list);
    } catch (error) {
      console.log("Error in get users with pagination", error.message);
      formatter.ErrorHandling(socket, error);
    }
  });
};

const getLastMessage = (socket) => {
  socket.on("get-last-message", async (email, userId) => {
    try {
      const token = parseCookie(socket.request);
      const sender = parsetoken(token);
      let conversation = await conversationModel
        .findOne({
          usersArray: { $all: [sender._id, userId] },
        })
        .populate("LastMessage");

      socket.emit(`last-message-${email}`, conversation, email);
    } catch (error) {
      console.log("Error in getting last message", error.message);
      formatter.ErrorHandling(socket, error);
    }
  });
};

const sendMessage = (socket, onlineUsers) => {
  socket.on("send-message", async (convId, reciever, message) => {
    try {
      const token = parseCookie(socket.request);
      const sender = parsetoken(token);
      const user = onlineUsers.findByUsername(reciever);

      //saving message to database with passing delaytime of saving
      //for parallel processing
      // Promise.resolve().then((_) => {
      //   createMessageInSocket(convId, message, sender._id);
      // });

      const newmessage = await createMessageInSocket(
        convId,
        message,
        sender._id
      );

      if (user?.id) {
        socket.to(user.id).emit("recieve-message", newmessage);
        socket.to(user.id).emit(`last-message-${sender.email}`, {
          LastMessage: { message: newmessage.message },
        });
        socket.to(user.id).emit(`highlight ${sender.email}`);
      }
      socket.emit("recieve-message", { ...newmessage, position: "R" });
    } catch (error) {
      console.log("Error in sending message", error.message);
      formatter.ErrorHandling(socket, error);
    }
  });
};

module.exports = {
  connect,
  disconnect,
  sendMessage,
  getLastMessage,
  getUsersWithPagination,
};
