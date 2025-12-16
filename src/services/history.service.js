const { pool } = require("../config/db");

/**
 * GET TRANSACTION HISTORY
 */
exports.getHistory = async (userId, offset, limit) => {
  const query = `
    SELECT
      invoice_number,
      transaction_type,
      description,
      total_amount,
      created_on
    FROM transactions
    WHERE user_id = $1
    ORDER BY created_on DESC
    OFFSET $2
    LIMIT $3
  `;

  const result = await pool.query(query, [userId, offset, limit]);

  return result.rows;
};
