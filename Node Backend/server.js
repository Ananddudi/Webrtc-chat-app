//express with socket.io
const express = require("express");
const { createServer } = require("node:http");
const { Server } = require("socket.io");
const userRouter = require("./routes/user.js");
const cookieParser = require("cookie-parser");
const fileUpload = require("express-fileupload");
const connection = require("./socket.connect.js");
const dotenv = require("dotenv");
const connnectDatabase = require("./db.js");
const path = require("path");
const messageRouter = require("./routes/message.js");
const cors = require("cors");
dotenv.config();

const PORT = process.env.PORT || 3005;

const app = express();
const httpServer = createServer(app);

const io = new Server(httpServer, {
  cookie: true,
  cors: {
    origin: process.env.APP_URL,
    methods: ["GET", "POST"],
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

app.use(express.static(path.join(__dirname, "public")));
app.use("/images", express.static(path.join(__dirname, "images")));

// test route
app.get("/api/test", (req, res) => {
  // Cookies that have not been signed
  console.log("Cookies: ", req.cookies);
  // Cookies that have been signed
  console.log("Signed Cookies: ", req.signedCookies);

  res.send("testing route");
});

app.use("/api", userRouter);
app.use("/api", messageRouter);

//socket
const live = io.of("/app");
connection(live);

app.get("*", function (req, res) {
  res.sendFile(path.join(__dirname, "public", "index.html"));
});

app.use("*", (req, res) => {
  res.send("This route does not exist!");
});

httpServer.listen(PORT, () => {
  console.log(`Server is running at ${PORT}`);
});
