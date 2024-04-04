// const express = require("express");
// const dotenv = require("dotenv");
// const runDB = require("./db.js");
// const userRouter = require("./routes/user.js");
// const cookieParser = require("cookie-parser");
// const fileUpload = require("express-fileupload");
// const path = require("path");

// dotenv.config();

// const app = express();

// app.use(express.json());
// app.use(cookieParser(process.env.COOKIE_SECRETS));
// app.use(
//   fileUpload({
//     tempFilePath: true,
//     limits: { fileSize: 50 * 1024 * 1024 }, // 50 MB
//   })
// );

// const PORT = process.env.PORT || 3005;

// try {
//   runDB();
//   console.log("Database connection is fine");
// } catch (error) {
//   console.log(error.message);
// }

// app.use("/public", express.static(path.join(__dirname, "public")));

// // test route
// app.get("/api/test", (req, res) => {
//   // Cookies that have not been signed
//   console.log("Cookies: ", req.cookies);
//   // Cookies that have been signed
//   console.log("Signed Cookies: ", req.signedCookies);

//   res.send("testing route");
// });

// app.use("/api", userRouter);

// app.listen(PORT, () => {
//   console.log(`Server is running on port ${PORT}`);
// });
