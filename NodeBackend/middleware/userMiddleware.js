const { formatter } = require("../error.js");
const { parsetoken } = require("../utils/parseToken.js");

async function authorization(req, res, next) {
  try {
    const cookie = req.cookies;
    if (!cookie.token) {
      const error = new Error("Please register!");
      error.statusCode = 404;
      throw error;
    }
    const user = parsetoken(cookie.token);
    req.user = user;
    next();
  } catch (error) {
    res
      .status(formatter[error.code] ? formatter[error.code].code : 500)
      .json(formatter.ErrorResponse(error.code, error.message));
  }
}

module.exports = { authorization };
