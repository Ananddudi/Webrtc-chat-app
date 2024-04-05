const { formatter } = require("../error");
const { parsetoken } = require("../utils/parseToken");
const parseCookie = require("../utils/parseCookie");
const fs = require("fs");
const path = require("path");
const { v4: uuidv4 } = require("uuid");
const conversationModel = require("../models/conversation");

const newpath = (filename) => {
  return path.join(__dirname, "..", "sharedFiles", uuidv4() + "-" + filename);
};

const getFile = (socket) => {
  //   const stream = fs.createReadStream("path_to_your_data_file.txt", {
  //     highWaterMark: 1024,
  //   });
  let imageBuffer = Buffer.alloc(0);
  socket.on("read-stream", async (fileData, cb) => {
    try {
      const fileBuffer = Buffer.from(fileData, "base64");
      imageBuffer = Buffer.concat([imageBuffer, fileBuffer]);
      cb();
    } catch (error) {
      console.log("error", error.message);
      formatter.ErrorHandling(socket, error);
    }
  });

  socket.on("stream-completion", async (filename) => {
    try {
      fs.writeFile(newpath(filename), imageBuffer, (err) => {
        if (err) {
          console.error("Error writing file:", err);
          formatter.ErrorHandling(socket, err);
          return;
        }
        console.log("File saved successfully.");
        socket.emit("file-status", "file received successfully");
      });
    } catch (error) {
      console.log("error in comple", error.message);
      formatter.ErrorHandling(socket, error);
    }
  });
};

module.exports = { getFile };
