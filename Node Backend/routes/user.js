const express = require("express");
const { authorization } = require("../middleware/userMiddleware.js");

const {
  fileUploadUser,
  loginUser,
  logout,
  registerUser,
  authentication,
  feedback,
} = require("../controllers/user.js");
const { invitation } = require("../controllers/invitation.js");

const router = express.Router();

router.route("/authentication-user").get(authorization, authentication);
router.route("/signup-user").post(registerUser);
router.route("/login-user").post(loginUser);
router.route("/logout-user").delete(logout);
router.route("/fileupload-user").post(authorization, fileUploadUser);
router.route("/invite-user").post(authorization, invitation);
router.route("/feedback-user").put(authorization, feedback);

module.exports = router;
