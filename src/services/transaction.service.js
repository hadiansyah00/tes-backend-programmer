const { pool } = require("../config/db");
const { success, error } = require("../utils/response");

/**
 * CREATE PAYMENT TRANSACTION
 */
exports.createTransaction = async (userId, serviceCode) => {
  const client = await pool.connect();

  const rollbackAndReturn = async (response) => {
    await client.query("ROLLBACK");
    return response;
  };

  try {
    await client.query("BEGIN");

    // 1️⃣ Ambil service
    const serviceResult = await client.query(
      `
      SELECT service_code, service_name, service_tariff
      FROM services
      WHERE service_code = $1
      `,
      [serviceCode]
    );

    if (serviceResult.rowCount === 0) {
      return rollbackAndReturn(
        error(102, "Service ataus Layanan tidak ditemukan")
      );
    }

    const service = serviceResult.rows[0];

    // 2️⃣ Cek balance
    const balanceResult = await client.query(
      `SELECT balance FROM balances WHERE user_id = $1`,
      [userId]
    );

    if (balanceResult.rowCount === 0) {
      return rollbackAndReturn(error(404, "Balance belum diinisialisasi"));
    }

    if (balanceResult.rows[0].balance < service.service_tariff) {
      return rollbackAndReturn(error(105, "Saldo tidak mencukupi"));
    }

    // 3️⃣ Generate invoice
    const dateStr = new Date().toISOString().slice(0, 10).replace(/-/g, "");
    const countResult = await client.query(
      `SELECT COUNT(*) FROM transactions WHERE invoice_number LIKE $1`,
      [`INV${dateStr}%`]
    );

    const sequence = String(Number(countResult.rows[0].count) + 1).padStart(
      4,
      "0"
    );
    const invoiceNumber = `INV${dateStr}-${sequence}`;

    // 4️⃣ Update balance
    await client.query(
      `
      UPDATE balances
      SET balance = balance - $1,
          updated_at = NOW()
      WHERE user_id = $2
      `,
      [service.service_tariff, userId]
    );

    // 5️⃣ Insert transaction
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
      VALUES ($1, $2, 'PAYMENT', $3, $4, $5)
      `,
      [
        userId,
        invoiceNumber,
        service.service_code,
        service.service_name,
        service.service_tariff,
      ]
    );

    await client.query("COMMIT");

    return success(200, "Transaksi berhasil", {
      invoice_number: invoiceNumber,
      service_code: service.service_code,
      description: service.service_name,
      transaction_type: "PAYMENT",
      total_amount: service.service_tariff,
      created_on: new Date(),
    });
  } catch (err) {
    await client.query("ROLLBACK");
    console.error("[TRANSACTION_SERVICE]", err);
    return error(500, "Terjadi kesalahan server");
  } finally {
    client.release();
  }
};
