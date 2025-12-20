const { pool } = require("../config/db");
const { success, error } = require("../utils/response");
const { generateInvoice } = require("../utils/invoice");

/**
 * CREATE PAYMENT TRANSACTION (ATOMIC & SAFE)
 */
exports.createTransaction = async (userId, serviceCode) => {
  const client = await pool.connect();

  try {
    await client.query("BEGIN");

    // ===============================
    // 1️⃣ Ambil service
    // ===============================
    const serviceResult = await client.query(
      `
      SELECT service_code, service_name, service_tariff
      FROM services
      WHERE service_code = $1
      `,
      [serviceCode]
    );

    if (serviceResult.rowCount === 0) {
      await client.query("ROLLBACK");
      return {
        httpCode: 404,
        body: error(99, "Service atau Layanan tidak ditemukan"),
      };
    }

    const service = serviceResult.rows[0];

    // ===============================
    // 2️⃣ Atomic potong saldo
    // ===============================
    const updateBalanceResult = await client.query(
      `
      UPDATE balances
      SET balance = balance - $1
      WHERE user_id = $2
        AND balance IS NOT NULL
        AND balance >= $1
      `,
      [service.service_tariff, userId]
    );

    if (updateBalanceResult.rowCount === 0) {
      await client.query("ROLLBACK");
      return {
        httpCode: 400,
        body: error(99, "Saldo tidak mencukupi"),
      };
    }

    // ===============================
    // 3️⃣ Generate invoice
    // ===============================
    const invoiceNumber = await generateInvoice(client);

    // ===============================
    // 4️⃣ Simpan transaksi
    // ===============================
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

    return {
      httpCode: 200,
      body: success(0, "Transaksi berhasil", {
        invoice_number: invoiceNumber,
        service_code: service.service_code,
        description: service.service_name,
        transaction_type: "PAYMENT",
        total_amount: service.service_tariff,
        created_on: new Date(),
      }),
    };
  } catch (err) {
    await client.query("ROLLBACK");
    console.error("[TRANSACTION_SERVICE_ERROR]", {
      message: err.message,
      stack: err.stack,
    });

    return {
      httpCode: 500,
      body: error(99, "Terjadi kesalahan server"),
    };
  } finally {
    client.release();
  }
};
