const pool = require("../config/db");
const { success, error } = require("../utils/response");

/**
 * PAYMENT TRANSACTION
 */
exports.createTransaction = async (email, service_code) => {
  const client = await pool.connect();

  try {
    await client.query("BEGIN");

    // Ambil service
    const serviceQuery = `
      SELECT service_code, service_name, service_tariff
      FROM services
      WHERE service_code = $1
    `;
    const serviceResult = await client.query(serviceQuery, [service_code]);

    if (serviceResult.rows.length === 0) {
      await client.query("ROLLBACK");
      return error(404, "Service tidak ditemukan");
    }

    const service = serviceResult.rows[0];

    // Ambil balance user
    const balanceQuery = `
      SELECT balance
      FROM users
      WHERE email = $1
      FOR UPDATE
    `;
    const balanceResult = await client.query(balanceQuery, [email]);

    if (balanceResult.rows.length === 0) {
      await client.query("ROLLBACK");
      return error(404, "User tidak ditemukan");
    }

    if (balanceResult.rows[0].balance < service.service_tariff) {
      await client.query("ROLLBACK");
      return error(400, "Saldo tidak mencukupi");
    }

    // Kurangi balance
    const updateBalanceQuery = `
      UPDATE users
      SET balance = balance - $1,
          updated_at = NOW()
      WHERE email = $2
    `;
    await client.query(updateBalanceQuery, [service.service_tariff, email]);

    // Generate invoice
    const invoice_number = Date.now().toString();

    // Insert transaksi PAYMENT
    const insertTransactionQuery = `
      INSERT INTO transactions (
        email,
        invoice_number,
        service_code,
        service_name,
        transaction_type,
        total_amount
      )
      VALUES ($1, $2, $3, $4, 'PAYMENT', $5)
      RETURNING invoice_number, service_code, service_name,
                transaction_type, total_amount, created_on
    `;

    const trxResult = await client.query(insertTransactionQuery, [
      email,
      invoice_number,
      service.service_code,
      service.service_name,
      service.service_tariff,
    ]);

    await client.query("COMMIT");

    return success("Transaksi berhasil", trxResult.rows[0]);
  } catch (err) {
    await client.query("ROLLBACK");
    console.error(err);
    return error(500, "Terjadi kesalahan server");
  } finally {
    client.release();
  }
};
