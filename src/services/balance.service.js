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
      return {
        httpCode: 200,
        body: success(0, "Saldo anda kosong", {
          balance: 0,
        }),
      };
    }

    return {
      httpCode: 200,
      body: success(0, "Get balance berhasil", {
        balance: result.rows[0].balance,
      }),
    };
  } catch (err) {
    console.error("GET BALANCE SERVICE ERROR:", err);
    return {
      httpCode: 500,
      body: error(500, "Terjadi kesalahan server"),
    };
  }
};
