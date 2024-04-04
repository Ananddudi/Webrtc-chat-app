const jwt = require("jsonwebtoken");

const parsetoken = (token) => {
  const data = jwt.verify(token, process.env.PRIVATEKEY);
  if (!data) {
    const error = new Error("User not found");
    error.statusCode = 404;
    throw error;
  }
  return data;
};

module.exports = { parsetoken };
