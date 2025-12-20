const bcrypt = require("bcryptjs");
const { success, error } = require("../utils/response");
const db = require("../config/db");

/**
 * REGISTER
 */
exports.register = async (payload) => {
  const { email, first_name, last_name, password } = payload;

  try {
    // 1️⃣ Cek email dulu
    const emailCheck = await db.query("SELECT 1 FROM users WHERE email = $1", [
      email,
    ]);

    if (emailCheck.rowCount > 0) {
      return {
        httpCode: 409,
        body: error(409, "Email sudah terdaftar"),
      };
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

    // 4️⃣ Success
    return {
      httpCode: 201,
      body: success(0, "Registrasi berhasil", null),
    };
  } catch (err) {
    console.error("[REGISTER_SERVICE_ERROR]", err);

    return {
      httpCode: 500,
      body: error(500, "Terjadi kesalahan server"),
    };
  }
};
