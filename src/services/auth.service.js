const bcrypt = require("bcryptjs");
const { generateToken } = require("../utils/jwt");
const { success, error } = require("../utils/response");

// MOCK DATABASE
const users = [];

exports.register = async (payload) => {
  const hashed = await bcrypt.hash(payload.password, 10);

  users.push({ ...payload, password: hashed });

  return success("Registrasi berhasil silahkan login");
};

exports.login = async ({ email, password }) => {
  const user = users.find((u) => u.email === email);
  if (!user) return error(103, "Username atau password salah");

  const match = await bcrypt.compare(password, user.password);
  if (!match) return error(103, "Username atau password salah");

  const token = generateToken({ email: user.email });
  return success("Login Sukses", { token });
};

exports.profile = (user) => {
  return success("Success", user);
};
