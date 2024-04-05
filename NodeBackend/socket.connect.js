const { getFile } = require("./socketControllers.js/file");
const {
  connect,
  disconnect,
  sendMessage,
  getLastMessage,
} = require("./socketControllers.js/user");

class OnlineUsers {
  constructor() {
    this.list = [];
  }
  addUser(id, username) {
    this.list = this.list.filter((val) => val.id !== id);
    this.list.push({ id, username });
  }
  removeUser(id) {
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
    getFile(socket);
    sendMessage(socket, onlineUsers);
    disconnect(io, socket, onlineUsers);
  });
}

module.exports = connection;
