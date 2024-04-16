//express with socket.io
const express = require("express");
// const { createServer } = require("node:https");
const http = require("http");
const { Server } = require("socket.io");
const userRouter = require("./routes/user.js");
const cookieParser = require("cookie-parser");
const fileUpload = require("express-fileupload");
const connection = require("./socket.connect.js");
const dotenv = require("dotenv");
const fs = require("fs");
const connnectDatabase = require("./db.js");
const path = require("path");
const messageRouter = require("./routes/message.js");
const cors = require("cors");
dotenv.config();

const PORT = process.env.PORT || 3005;

const app = express();

// const key = fs.readFileSync("cert.key");
// const cert = fs.readFileSync("cert.crt");

// const httpServer = createServer({ key, cert }, app);
const httpServer = http.createServer(app);

const io = new Server(httpServer, {
  maxHttpBufferSize: 1e8, // 100 MB
  cookie: true,
  cors: {
    origin: [
      "http://localhost:3000",
      process.env.APP_URL,
      "http://192.168.42.160:3000",
    ],
    methods: ["GET", "POST"],
    allowedHeaders: ["my-custom-header"],
    credentials: true,
  },
});

app.use(cors());
app.use(express.json());
app.use(cookieParser(process.env.COOKIE_SECRETS));
app.use(
  fileUpload({
    tempFilePath: true,
    limits: { fileSize: 50 * 1024 * 1024 }, // 50 MB
  })
);

connnectDatabase();

app.use("/images", express.static(path.join(__dirname, "images")));
app.use("/sharedFiles", express.static(path.join(__dirname, "sharedFiles")));

// test route
app.get("/api/test", (req, res) => {
  // Cookies that have not been signed
  console.log("Cookies: ", req.cookies);
  // Cookies that have been signed
  console.log("Signed Cookies: ", req.signedCookies);

  res.send("testing route");
});

app.get("/test", (req, res) => {
  res.send("sending test route!");
});
app.use("/api", userRouter);
app.use("/api", messageRouter);

//socket
const live = io.of("/app");
connection(live);

app.use("*", (req, res) => {
  res.send("This route does not exist!");
});

httpServer.listen(PORT, () => {
  console.log(`Server is running at ${PORT}`);
});
