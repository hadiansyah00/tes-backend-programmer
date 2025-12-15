const pool = require("../config/db");
const { success, error } = require("../utils/response");

/**
 * GET TRANSACTION HISTORY
 */
exports.getHistory = async (email, limit) => {
  try {
    let query = `
      SELECT invoice_number, transaction_type,
             service_code, service_name,
             total_amount, created_on
      FROM transactions
      WHERE email = $1
      ORDER BY created_on DESC
    `;

    const params = [email];

    if (limit) {
      query += ` LIMIT $2`;
      params.push(limit);
    }

    const result = await pool.query(query, params);

    return success("Sukses", result.rows);
  } catch (err) {
    console.error(err);
    return error(500, "Terjadi kesalahan server");
  }
};
