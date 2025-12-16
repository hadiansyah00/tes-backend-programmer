const bcrypt = require("bcryptjs");
const { generateToken } = require("../utils/jwt");
const { success, error } = require("../utils/response");
const pool = require("../config/db"); // pool dari pg
/**
 * LOGIN
 */
exports.login = async ({ email, password }) => {
  try {
    const query = "SELECT * FROM users WHERE email = $1";
    const result = await pool.query(query, [email]);

    if (result.rows.length === 0) {
      return error(103, "Username atau password salah");
    }

    const user = result.rows[0];

    // Cek password
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return error(103, "Username atau password salah");
    }

    // Generate token
    const token = generateToken({
      id: user.id,
      email: user.email,
    });

    return success("Login sukses", { token });
  } catch (err) {
    console.error(err);
    return error(500, "Terjadi kesalahan server");
  }
};
