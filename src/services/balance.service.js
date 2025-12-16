const { pool } = require("../config/db");
const { success, error } = require("../utils/response");

/**
 * GET BALANCE BY USER ID
 */
exports.getBalanceByUserId = async (userId) => {
  try {
    const query = `
      SELECT balance
      FROM balances
      WHERE user_id = $1
    `;

    const result = await pool.query(query, [userId]);

    if (result.rowCount === 0) {
      return error(404, "Balance belum diinisialisasi");
    }

    return success(200, "Get Balance Berhasil", {
      balance: result.rows[0].balance,
    });
  } catch (err) {
    console.error("GET BALANCE SERVICE ERROR:", err);
    return error(500, "Terjadi kesalahan server");
  }
};
