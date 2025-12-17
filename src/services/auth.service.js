const bcrypt = require("bcryptjs");
const { generateToken } = require("../utils/jwt");
const { success, error } = require("../utils/response");
const pool = require("../config/db");

/**
 * LOGIN SERVICE
 */
exports.login = async ({ email, password }) => {
  try {
    const query = "SELECT id, email, password FROM users WHERE email = $1";
    const result = await pool.query(query, [email]);

    // ❌ Email tidak ditemukan
    if (result.rows.length === 0) {
      return {
        httpCode: 401,
        body: error(103, "Username atau password salah"),
      };
    }

    const user = result.rows[0];

    // ❌ Password salah
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return {
        httpCode: 401,
        body: error(103, "Username atau password salah"),
      };
    }

    // ✅ Generate token
    const token = generateToken({
      id: user.id,
      email: user.email,
    });

    // ✅ SUCCESS
    return {
      httpCode: 200,
      body: success(0, "Login sukses", {
        token,
      }),
    };
  } catch (err) {
    console.error("[LOGIN_SERVICE_ERROR]", err);
    return {
      httpCode: 500,
      body: error(500, "Terjadi kesalahan server"),
    };
  }
};
