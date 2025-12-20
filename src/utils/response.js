exports.success = (status = 0, message = "Sukses", data = null) => {
  return {
    status,
    message,
    data,
  };
};

exports.error = (status = 99, message = "Terjadi kesalahan") => {
  return {
    status,
    message,
    data: null,
  };
};
