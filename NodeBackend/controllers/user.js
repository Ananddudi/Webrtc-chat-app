const { formatter } = require("../error.js");
const userModel = require("../models/user.js");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const path = require("path");
const { v4: uuidv4 } = require("uuid");
const fs = require("fs");

const fileUploadUser = async (req, res) => {
  try {
    const userInfo = req.user;
    const file = req.files.profilepic;
    const user = await userModel.findOne({ email: userInfo.email });
    if (!user) {
      const error = new Error("User probably gets deleted!");
      error.statusCode = 403;
      throw error;
    }
    if (!file) {
      const error = new Error("Please select file!");
      error.statusCode = 403;
      throw error;
    }

    if (!file.mimetype.startsWith("image") || file.mimetype.endsWith("gif")) {
      const error = new Error("Only image file is accepted!");
      error.statusCode = 403;
      throw error;
    }

    const filename = uuidv4() + "-" + file.name;
    const filepath = path.join(__dirname, "..", "images", filename);

    const storePath = `${process.env.SERVER_URL}/images/${filename}`;

    const newuser = await userModel.findOneAndUpdate(
      {
        _id: user.toObject()._id,
      },
      { profilepic: storePath }
    );
    await file.mv(filepath);

    //deleting file
    let fpath = newuser.profilepic;
    fpath = path.join(
      __dirname,
      "../images",
      fpath.slice(fpath.indexOf("images") + 7)
    );
    fs.unlink(fpath, (err) => {
      console.log(err);
    });

    res.status(201).json(formatter.SuccessResponse(201, newuser.toObject()));
  } catch (error) {
    res
      .status(formatter[error.code] ? formatter[error.code].code : 500)
      .json(formatter.ErrorResponse(error.code, error.message));
  }
};

const authentication = async (req, res) => {
  try {
    const userInfo = req.user;
    const user = await userModel.findOne({ email: userInfo.email });
    if (!user) {
      const error = new Error("User probably gets deleted!");
      error.statusCode = 403;
      throw error;
    }
    const { password, ...rest } = user.toObject();
    res.status(201).json(formatter.SuccessResponse(201, rest));
  } catch (error) {
    res
      .status(formatter[error.code] ? formatter[error.code].code : 500)
      .json(formatter.ErrorResponse(error.code, error.message));
  }
};

const updateAndGetList = async (username, val) => {
  const user = await userModel.findOneAndUpdate(
    { email: username },
    { available: val },
    { new: true }
  );
  if (!user) {
    const error = new Error("User does not found");
    error.statusCode = 403;
    throw error;
  }

  let allusers = await userModel.aggregate([
    {
      $sort: {
        available: -1,
      },
    },
    {
      $project: {
        password: 0,
        feedback: 0,
        updatedAt: 0,
        __v: 0,
      },
    },
  ]);

  return allusers;
};

const registerUser = async (req, res) => {
  try {
    const user = userModel(req.body);
    await user.save();

    let token = jwt.sign(user.toObject(), process.env.PRIVATEKEY, {
      expiresIn: "30d",
    });

    let expireTime = new Date(
      Date.now() + process.env.COOKIE_EXPIRE_TIME * 24 * 60 * 1000
    );

    res.cookie("token", token, {
      expires: expireTime,
      httpOnly: true,
    });

    const { password, ...rest } = user.toObject();
    res.status(201).json(formatter.SuccessResponse(201, rest));
  } catch (error) {
    res
      .status(formatter[error.code] ? formatter[error.code].code : 500)
      .json(formatter.ErrorResponse(error.code, error.message));
  }
};

const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await userModel.findOne({ email });
    if (!user) {
      const error = new Error("User not found!");
      error.statusCode = 404;
      throw error;
    }

    let userCheck = await bcrypt.compare(password, user.password);

    if (!userCheck) {
      const error = new Error("Possword does not match");
      error.statusCode = 404;
      throw error;
    }

    let token = jwt.sign(user.toObject(), process.env.PRIVATEKEY, {
      expiresIn: "30d",
    });

    let expireTime = new Date(
      Date.now() + process.env.COOKIE_EXPIRE_TIME * 24 * 60 * 1000
    );

    res.cookie("token", token, {
      expires: expireTime,
      httpOnly: true,
    });

    const { password: newpassword, ...rest } = user.toObject();
    res.status(200).json(formatter.SuccessResponse(200, rest));
  } catch (error) {
    res
      .status(formatter[error.code] ? formatter[error.code].code : 500)
      .json(formatter.ErrorResponse(error.code, error.message));
  }
};

const logout = async (req, res) => {
  try {
    res.cookie("token", "logout", {
      expires: new Date(Date.now()),
      httpOnly: true,
    });
    res.status(200).json(formatter.SuccessResponse(200, { logout: "success" }));
  } catch (error) {
    res
      .status(formatter[error.code] ? formatter[error.code].code : 500)
      .json(formatter.ErrorResponse(error.code, error.message));
  }
};

const feedback = async (req, res) => {
  try {
    const user = req.user;
    const feedback = req.body.feedback;
    if (!feedback) {
      const error = new Error("please provide some feedback");
      error.statusCode = 404;
      throw error;
    }
    const userInfo = await userModel.findOneAndUpdate(
      { email: user.email },
      {
        feedback: feedback,
      },
      { new: true }
    );
    res.status(200).json(formatter.SuccessResponse(200, { userInfo }));
  } catch (error) {
    res
      .status(formatter[error.code] ? formatter[error.code].code : 500)
      .json(formatter.ErrorResponse(error.code, error.message));
  }
};

module.exports = {
  loginUser,
  logout,
  feedback,
  registerUser,
  fileUploadUser,
  authentication,
  updateAndGetList,
};
