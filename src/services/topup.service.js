const pool = require("../config/db");
const { success, error } = require("../utils/response");

/**
 * TOP UP BALANCE USER
 */
exports.topup = async (email, amount) => {
  if (!amount || isNaN(amount) || amount <= 0) {
    return error(400, "Amount harus berupa angka dan lebih dari 0");
  }

  const client = await pool.connect();

  try {
    await client.query("BEGIN");

    // Update balance user
    const updateBalanceQuery = `
      UPDATE users
      SET balance = balance + $1,
          updated_at = NOW()
      WHERE email = $2
      RETURNING balance
    `;
    const balanceResult = await client.query(updateBalanceQuery, [
      amount,
      email,
    ]);

    if (balanceResult.rows.length === 0) {
      await client.query("ROLLBACK");
      return error(404, "User tidak ditemukan");
    }

    // Insert transaksi TOPUP
    const insertTransactionQuery = `
      INSERT INTO transactions (
        email,
        transaction_type,
        total_amount
      )
      VALUES ($1, 'TOPUP', $2)
    `;
    await client.query(insertTransactionQuery, [email, amount]);

    await client.query("COMMIT");

    return success("Top Up Balance Success", {
      balance: balanceResult.rows[0].balance,
    });
  } catch (err) {
    await client.query("ROLLBACK");
    console.error(err);
    return error(500, "Terjadi kesalahan server");
  } finally {
    client.release();
  }
};
