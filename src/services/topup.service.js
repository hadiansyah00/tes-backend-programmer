const { pool } = require("../config/db");
const { success, error } = require("../utils/response");
const { generateInvoice } = require("../utils/invoice");

exports.topup = async (userId, amount) => {
  if (!amount || isNaN(amount) || amount <= 0) {
    return error(400, "Parameter amount harus berupa angka dan lebih dari 0");
  }

  const client = await pool.connect();

  try {
    await client.query("BEGIN");

    // 1️⃣ UPSERT saldo (ATOMIC, updated_at VALID)
    const balanceResult = await client.query(
      `
      INSERT INTO balances (user_id, balance)
      VALUES ($1, $2)
      ON CONFLICT (user_id)
      DO UPDATE SET
        balance = balances.balance + EXCLUDED.balance,
        updated_at = NOW()
      RETURNING balance
      `,
      [userId, amount]
    );

    // 2️⃣ Invoice aman & unik
    const invoiceNumber = await generateInvoice(client);

    // 3️⃣ Catat transaksi
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

    return success(200, "Top Up Balance berhasil", {
      balance: balanceResult.rows[0].balance,
    });
  } catch (err) {
    await client.query("ROLLBACK");
    console.error("[TOPUP_SERVICE_ERROR]", err);
    return error(500, "Terjadi kesalahan server");
  } finally {
    client.release();
  }
};
