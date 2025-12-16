exports.success = (httpCode = 200, message = "Success", data = null) => {
  return {
    httpCode,
    body: {
      status: 0,
      message,
      data,
    },
  };
};

exports.error = (
  httpCode = 400,
  message = "Terjadi kesalahan",
  appCode = 99
) => {
  return {
    httpCode,
    body: {
      status: appCode,
      message,
      data: null,
    },
  };
};
