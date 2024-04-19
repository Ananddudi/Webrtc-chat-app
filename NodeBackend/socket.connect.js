const { handleFile } = require("./socketControllers.js/file");
const { handleConnection } = require("./socketControllers.js/rtc");
const {
  connect,
  disconnect,
  sendMessage,
  getLastMessage,
  getUsersWithPagination,
} = require("./socketControllers.js/user");

class OnlineUsers {
  constructor() {
    this.list = [];
  }
  isExist({ username, id }) {
    if (id) {
      return this.list.some((val) => val.id == id);
    }
    return this.list.some((val) => val.username == username);
  }
  addUser(id, username) {
    if (this.isExist({ username })) {
      return "exist";
    } else {
      this.list.push({ id, username });
    }
  }
  removeUser(id) {
    if (!this.isExist({ id })) {
      return null;
    }
    let index = this.list.findIndex((val) => val.id == id);
    return this.list.splice(index, 1)[0];
  }
  findByUsername(username) {
    try {
      const user = this.list.find((val) => val.username == username);
      user || console.log(username, "is not online");
      return user;
    } catch (error) {
      console.log("User not found in online list!");
    }
  }
}

//maintaining live users
const onlineUsers = new OnlineUsers();

function connection(io) {
  io.on("connection", (socket) => {
    console.log("socket is connected", socket.id);
    // socket.request.headers.cookie
    connect(io, socket, onlineUsers);
    getLastMessage(socket);
    getUsersWithPagination(socket);
    handleFile(socket, onlineUsers);
    sendMessage(socket, onlineUsers);
    handleConnection(socket, onlineUsers);
    disconnect(io, socket, onlineUsers);
  });
}

module.exports = connection;
