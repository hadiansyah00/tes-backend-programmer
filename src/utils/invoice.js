exports.generateInvoice = async (client) => {
  const now = new Date();

  const day = String(now.getDate()).padStart(2, "0");
  const month = String(now.getMonth() + 1).padStart(2, "0");
  const year = now.getFullYear();

  const dateStr = `${day}${month}${year}`;

  const countResult = await client.query(
    `
    SELECT COUNT(*)::int AS total
    FROM transactions
    WHERE DATE(created_on) = CURRENT_DATE
    `
  );

  const sequence = String(countResult.rows[0].total + 1).padStart(3, "0");

  return `INV${dateStr}-${sequence}`;
};
