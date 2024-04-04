const express = require("express");
const { authorization } = require("../middleware/userMiddleware.js");
const {
  createORgetConversation,
  getMessages,
  deleteConversation,
} = require("../controllers/message.js");

const router = express.Router();
//get
router.route("/get-all-messages/:id").get(authorization, getMessages);

//Bcoz we are dealing with all users on frontend side instead of single user's conversation
// router
//   .route("/user-conversation/:userOne/:userTwo")
//   .get(authorization, getConversation);

router
  .route("/create-conversation")
  .post(authorization, createORgetConversation);

//delete
router
  .route("/delete-conversation/:id")
  .delete(authorization, deleteConversation);

module.exports = router;
