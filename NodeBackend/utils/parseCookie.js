const parseCookie = (request) => {
  const cookieString = request.headers.cookie;
  if (!cookieString || cookieString.indexOf("token") == -1) {
    const error = new Error("Unauthorized access!");
    error.statusCode = 404;
    throw error;
  }
  let token = cookieString.slice(cookieString.indexOf("token") + 6);
  if (token.indexOf(";") !== -1) {
    token = token.slice(0, token.indexOf(";"));
  }
  return token;
};

module.exports = parseCookie;
