const pool = require("../config/db");
const { success, error } = require("../utils/response");

/**
 * GET BALANCE USER
 */
exports.getBalance = async (email) => {
  try {
    const query = `
      SELECT balance
      FROM users
      WHERE email = $1
    `;

    const result = await pool.query(query, [email]);

    if (result.rows.length === 0) {
      return error(404, "User tidak ditemukan");
    }

    return success("Sukses", {
      balance: result.rows[0].balance,
    });
  } catch (err) {
    console.error(err);
    return error(500, "Terjadi kesalahan server");
  }
};
