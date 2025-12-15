const bcrypt = require("bcryptjs");
const { generateToken } = require("../utils/jwt");
const { success, error } = require("../utils/response");
const pool = require("../config/db"); // pool dari pg

/**
 * REGISTER
 */
exports.register = async (payload) => {
  try {
    const { email, first_name, last_name, password } = payload;

    // Cek apakah user sudah ada
    const checkQuery = "SELECT email FROM users WHERE email = $1";
    const checkResult = await pool.query(checkQuery, [email]);
    if (checkResult.rows.length > 0) {
      return error(101, "Email sudah terdaftar");
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Simpan ke DB
    const insertQuery = `
      INSERT INTO users (email, first_name, last_name, password)
      VALUES ($1, $2, $3, $4)
      RETURNING email, first_name, last_name
    `;
    const insertParams = [email, first_name, last_name, hashedPassword];
    const result = await pool.query(insertQuery, insertParams);

    return success("Registrasi berhasil silahkan login", result.rows[0]);
  } catch (err) {
    console.error(err);
    return error(500, "Terjadi kesalahan server");
  }
};

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
    const token = generateToken({ email: user.email });

    return success("Login sukses", { token });
  } catch (err) {
    console.error(err);
    return error(500, "Terjadi kesalahan server");
  }
};
