exports.success = (httpCode, message, data = null) => {
  return {
    httpCode,
    body: {
      status: 0,
      message,
      data,
    },
  };
};

exports.error = (httpCode, message) => {
  return {
    httpCode,
    body: {
      status: 99,
      message,
      data: null,
    },
  };
};
