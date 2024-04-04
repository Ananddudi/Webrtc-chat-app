const formatter = {
  200: {
    code: 200,
    message: "OK: The request has succeeded",
  },
  201: {
    code: 201,
    message:
      "Created: The request has been fulfilled, resulting in the creation of a new resource.",
  },
  204: {
    code: 204,
    message:
      "No Content: The server successfully processed the request and is not returning any content.",
  },
  400: {
    code: 400,
    message:
      "Bad Request: The server cannot process the request due to a client error.",
  },
  403: {
    code: 403,
    message:
      "Forbidden: The server understood the request, but refuses to authorize it.",
  },
  404: {
    code: 404,
    message: "Not Found: The requested resource could not be found.",
  },
  405: {
    code: 405,
    message:
      "Method Not Allowed: The method specified in the request is not allowed for the resource",
  },
  409: {
    code: 409,
    message: "Conflict: The Record is alread exist.",
  },
  422: {
    code: 422,
    message:
      "Unprocessable Entity: The server understands the content type of the request entity but was unable to process the contained instructions.",
  },
  500: {
    code: 500,
    message:
      "Internal Server Error: A generic error message indicating that something went wrong on the server's end.",
  },
  501: {
    code: 501,
    message:
      "Not Implemented: The server does not support the functionality required to fulfill the request.",
  },
  502: {
    code: 502,
    message:
      "Bad Gateway: The server received an invalid response from an upstream server while attempting to fulfill the request.",
  },
  503: {
    code: 503,
    message:
      "Service Unavailable: The server is currently unable to handle the request due to temporary overloading or maintenance of the server.",
  },
  11000: {
    code: 409,
    message: "Conflict: The Record is alread exist.",
  },

  ErrorResponse: function (code, message) {
    if (!code || !this[code]) {
      return {
        error: true,
        code: 500,
        message,
      };
    }
    return {
      error: true,
      code: this[code].code,
      message: this[code].message,
    };
  },
  SuccessResponse: function (code, object) {
    return {
      error: false,
      code,
      message: this[code].message,
      ...object,
    };
  },
  ErrorHandling: function (socket, error) {
    socket.to(socket.io).emit("error", error.message);
  },
};

module.exports = { formatter };
