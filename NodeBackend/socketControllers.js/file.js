const { formatter } = require("../error");
const { parsetoken } = require("../utils/parseToken");
const parseCookie = require("../utils/parseCookie");
const fs = require("fs");
const path = require("path");
const { v4: uuidv4 } = require("uuid");
const { createMessageInSocket } = require("../controllers/message");
const { promisify } = require("util");

const writeFileAsync = promisify(fs.writeFile);

const newpath = (filename) => {
  const newfilename = uuidv4() + "-" + filename;
  const filepath = path.join(__dirname, "..", "sharedFiles", newfilename);
  const storePath = `${process.env.SERVER_URL}/sharedFiles/${newfilename}`;
  return [filepath, storePath];
};

const handleFile = (socket, onlineUsers) => {
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

  socket.on(
    "stream-completion",
    async (filename, filetype, convId, reciever) => {
      try {
        const token = parseCookie(socket.request);
        const sender = parsetoken(token);
        const [filepath, storedPath] = newpath(filename);

        await writeFileAsync(filepath, imageBuffer);

        let type = filetype.split("/")[0];

        console.log("File saved successfully.");
        const newmessage = await createMessageInSocket(
          convId,
          storedPath,
          sender._id,
          type
        );
        const user = onlineUsers.findByUsername(reciever);

        if (user?.id) {
          socket.to(user.id).emit("recieve-message", newmessage);
        }
        socket.emit("recieve-message", { ...newmessage, position: "R" });
        // IMPORTANT: here i am directly giving url in message to client can show using media tags but below i have
        // implemented code for streaming data from node to client which will give same functionality but more efficient.
        // If i use below method to show media on frontend then i will have to also write same code when first time user get-all-messages using
        // get api so lets stick with above architecture for now

        // Node side code
        //   let fileStream = fs.createReadStream(savedPath, {
        //     highWaterMark: 1024,
        //     encoding: "base64",
        //   });
        //   fileStream.on("data", (chunk) => {
        //     socket.to(user.id).emit("get-chunks", chunk);
        //   });
        //   fileStream.on("end", () => {
        //     socket.to(user.id).emit("recieve-media", "file received successfully");
        //   });
        //   fileStream.on("error", () => {
        //     formatter.ErrorHandling(socket, error);
        //   });

        //   client side code
        //   useEffect(() => {
        //     let base64Data = "";
        //     const getMessageChunks = (chunk) => {
        //       base64Data += chunk;
        //     };
        //     const mediaStatus = (msg) => {
        //       console.log("file status->", msg, base64Data);
        //     };
        //     socket.on("get-chunks", getMessageChunks);
        //     socket.on("recieve-media", mediaStatus);
        //     return () => {
        //       socket.off("get-chunks", getMessageChunks);
        //       socket.off("recieve-media", mediaStatus);
        //     };
        //   }, []);
      } catch (error) {
        console.log("error in File upload", error.message);
        formatter.ErrorHandling(socket, error);
      }
    }
  );
};

module.exports = { handleFile };
