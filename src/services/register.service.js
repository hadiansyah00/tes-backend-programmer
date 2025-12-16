const bcrypt = require("bcryptjs");
const { generateToken } = require("../utils/jwt");
const { success, error } = require("../utils/response");
const db = require("../config/db");

/**
 * REGISTER
 */
exports.register = async (payload) => {
  const { email, first_name, last_name, password } = payload;

  try {
    // 1️⃣ Cek email dulu (WAJIB)
    const emailCheck = await db.query("SELECT 1 FROM users WHERE email = $1", [
      email,
    ]);

    if (emailCheck.rowCount > 0) {
      return error(409, "Email sudah terdaftar", 409);
    }

    // 2️⃣ Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // 3️⃣ Insert user
    await db.query(
      `
      INSERT INTO users (email, first_name, last_name, password)
      VALUES ($1, $2, $3, $4)
      `,
      [email, first_name, last_name, hashedPassword]
    );

    return success(200, "Registrasi berhasil", null);
  } catch (err) {
    console.error("[REGISTER_SERVICE_ERROR]", err);
    return error(500, "Terjadi kesalahan server");
  }
};
