const { formatter } = require("../error");
const sendMail = require("../services/mail.js");

const invitation = async (req, res) => {
  try {
    const user = req.user;
    const { email } = req.body;
    const { accepted, rejected, response } = await sendMail(
      email,
      user.fullname
    );
    if (rejected.length) {
      let error = new Error("Error occured while sending mail!");
      error.statusCode = 422;
      throw error;
    }
    res.status(201).json(formatter.SuccessResponse(201, {}));
  } catch (error) {
    res
      .status(formatter[error.code] ? formatter[error.code].code : 500)
      .json(formatter.ErrorResponse(error.code, error.message));
  }
};

module.exports = { invitation };
