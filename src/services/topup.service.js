const { pool } = require("../config/db");
const { success, error } = require("../utils/response");
const { generateInvoice } = require("../utils/invoice");

exports.topup = async (userId, amount) => {
  const client = await pool.connect();

  try {
    await client.query("BEGIN");

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

    const balanceAfter = balanceResult.rows[0].balance;

    const invoiceNumber = await generateInvoice(client);

    const trxResult = await client.query(
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
      RETURNING invoice_number, total_amount
      `,
      [userId, invoiceNumber, amount]
    );

    await client.query("COMMIT");

    return {
      httpCode: 200,
      body: success(0, "Top Up Balance berhasil", {
        invoice_number: trxResult.rows[0].invoice_number,
        total_amount: trxResult.rows[0].total_amount,
        balance: balanceAfter,
      }),
    };
  } catch (err) {
    await client.query("ROLLBACK");
    console.error("[TOPUP_SERVICE_ERROR]", err);

    return {
      httpCode: 500,
      body: error(99, "Terjadi kesalahan server"),
    };
  } finally {
    client.release();
  }
};
