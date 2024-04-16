const { formatter } = require("../error.js");
const userModel = require("../models/user.js");
const messageModel = require("../models/message.js");
const conversationModel = require("../models/conversation.js");
const { default: mongoose } = require("mongoose");

const getMessages = async (req, res) => {
  try {
    let user = req.user;
    let id = req.params.id;
    if (!mongoose.Types.ObjectId.isValid(id.toString())) {
      const error = new Error("Conversation valid id is required!");
      error.statusCode = 403;
      throw error;
    }
    let messages = await messageModel.aggregate([
      {
        $match: {
          convId: new mongoose.mongo.ObjectId(id.toString()),
        },
      },
      {
        $sort: {
          createdAt: 1,
        },
      },
      {
        $addFields: {
          position: {
            $cond: {
              if: { $eq: [{ $toString: "$sender" }, { $toString: user._id }] },
              then: "R",
              else: "L",
            },
          },
        },
      },
      {
        $project: {
          _id: 0,
          updatedAt: 0,
          convId: 0,
          __v: 0,
          sender: 0,
        },
      },
    ]);

    res
      .status(201)
      .json(
        formatter.SuccessResponse(201, { messages, count: messages.length })
      );
  } catch (error) {
    res
      .status(formatter[error.code] ? formatter[error.code].code : 500)
      .json(formatter.ErrorResponse(error.code, error.message));
  }
};

const createMessageInSocket = async (
  convId,
  message,
  userId,
  type = "text"
) => {
  if (!convId || !message || !userId) {
    const error = new Error("All fields are necessary");
    error.statusCode = 403;
    throw error;
  }

  if (
    !mongoose.Types.ObjectId.isValid(convId.toString()) ||
    !mongoose.Types.ObjectId.isValid(userId.toString())
  ) {
    const error = new Error("Id is not valid");
    error.statusCode = 403;
    throw error;
  }

  const conversation = await conversationModel.findById(convId);
  if (!conversation) {
    const error = new Error("No conversation found!");
    error.statusCode = 403;
    throw error;
  }

  const newmessage = await messageModel.create({
    sender: userId,
    convId,
    message,
    type,
  });

  const {
    convId: conversatioId,
    sender,
    _id,
    updatedAt,
    __v,
    ...restMsg
  } = newmessage.toObject();

  return { ...restMsg, position: "L" };
};

const createORgetConversation = async (req, res) => {
  try {
    const { userTwo } = req.body;
    const userOne = req.user;
    let conversation = null;
    if (!mongoose.Types.ObjectId.isValid(userTwo.toString())) {
      const error = new Error("Id is not valid");
      error.statusCode = 403;
      throw error;
    }

    const users = await userModel.find({
      _id: { $in: [userOne._id, userTwo] },
    });

    if (users.length !== 2) {
      const error = new Error("Please make sure both user is registered!");
      error.statusCode = 403;
      throw error;
    }

    conversation = await conversationModel
      .findOne({
        usersArray: { $all: [userOne, userTwo] },
      })
      .populate("usersArray");

    if (!conversation) {
      conversation = await conversationModel.create({
        usersArray: [userOne, userTwo],
      });
      conversation = await conversationModel.populate(conversation, {
        path: "usersArray",
      }); //other way to populate
    }

    res.status(201).json(
      formatter.SuccessResponse(201, {
        conversation,
      })
    );
  } catch (error) {
    res
      .status(formatter[error.code] ? formatter[error.code].code : 500)
      .json(formatter.ErrorResponse(error.code, error.message));
  }
};

const deleteConversation = async (req, res) => {
  try {
    const id = req.params.id;
    if (!mongoose.Types.ObjectId.isValid(id.toString())) {
      const error = new Error("Id is not valid");
      error.statusCode = 403;
      throw error;
    }

    const conversation = await conversationModel.findOneAndUpdate(
      { _id: id },
      {
        deleteStatus: true,
      }
    );

    if (!conversation || conversation.deleteStatus) {
      const error = new Error("No conversation found!");
      error.statusCode = 403;
      throw error;
    }
    res.status(201).json(formatter.SuccessResponse(201, {}));
  } catch (error) {
    res
      .status(formatter[error.code] ? formatter[error.code].code : 500)
      .json(formatter.ErrorResponse(error.code, error.message));
  }
};

module.exports = {
  createORgetConversation,
  getMessages,
  deleteConversation,
  createMessageInSocket,
};

// const getConversation = async (req, res) => {
//   try {
//     const { userOne, userTwo } = req.params;
//     if (!userOne || !userTwo) {
//       const error = new Error("Both ids are required!");
//       error.statusCode = 403;
//       throw error;
//     }
//     const conversation = await conversationModel.aggregate([
//       {
//         $match: {
//           usersArray: { $all: [userOne, userTwo] },
//         },
//       },
//       {
//         $limit: 1,
//       },
//     ]);
//     res.status(201).json(formatter.SuccessResponse(201, { conversation }));
//   } catch (error) {
//     res
//       .status(formatter[error.code] ? formatter[error.code].code : 500)
//       .json(formatter.ErrorResponse(error.code, error.message));
//   }
// };

// const getConversations = async (req, res) => {
//   try {
//     const conversations = await conversationModel.aggregate([
//       {
//         $sort: {
//           createdAt: -1,
//         },
//       },
//     ]);
//     res.status(201).json(formatter.SuccessResponse(201, { conversations }));
//   } catch (error) {
//     res
//       .status(formatter[error.code] ? formatter[error.code].code : 500)
//       .json(formatter.ErrorResponse(error.code, error.message));
//   }
// };
