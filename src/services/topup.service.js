const { pool } = require("../config/db");
const { success, error } = require("../utils/response");

exports.topup = async (userId, amount) => {
  if (!amount || isNaN(amount) || amount <= 0) {
    return error(
      102,
      "Paramter amount hanya boleh angka dan tidak boleh lebih kecil dari 0"
    );
  }

  const client = await pool.connect();

  try {
    await client.query("BEGIN");

    // 1️⃣ UPSERT BALANCE (Nambah, bukan replace)
    const upsertBalanceQuery = `
      INSERT INTO balances (user_id, balance)
      VALUES ($1, $2)
      ON CONFLICT (user_id)
      DO UPDATE SET
        balance = balances.balance + EXCLUDED.balance,
        updated_at = NOW()
      RETURNING balance
    `;

    const balanceResult = await client.query(upsertBalanceQuery, [
      userId,
      amount,
    ]);

    // 2️⃣ Generate invoice number
    const today = new Date();
    const dateStr = today
      .toISOString()
      .slice(0, 10)
      .split("-")
      .reverse()
      .join("");

    const countResult = await client.query(
      `
      SELECT COUNT(*) FROM transactions
      WHERE DATE(created_on) = CURRENT_DATE
      `
    );

    const sequence = String(Number(countResult.rows[0].count) + 1).padStart(
      3,
      "0"
    );

    const invoiceNumber = `INV${dateStr}-${sequence}`;

    // 3️⃣ Insert transaction TOPUP
    await client.query(
      `
      INSERT INTO transactions (
        user_id,
        invoice_number,
        transaction_type,
        service_code,
        description,
        total_amount
      )
      VALUES ($1, $2, 'TOPUP', NULL, 'Top Up Balance', $3)
      `,
      [userId, invoiceNumber, amount]
    );

    await client.query("COMMIT");

    return success(200, "Top Up Balance Success", {
      balance: balanceResult.rows[0].balance,
    });
  } catch (err) {
    await client.query("ROLLBACK");
    console.error("TOPUP SERVICE ERROR:", err);
    return error(500, "Terjadi kesalahan server");
  } finally {
    client.release();
  }
};
