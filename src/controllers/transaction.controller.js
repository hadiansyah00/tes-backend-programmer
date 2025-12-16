const transactionService = require("../services/transaction.service");

/**
 * PAYMENT TRANSACTION
 */
exports.transaction = async (req, res) => {
  const { id } = req.user; // ✅ dari JWT
  const { service_code } = req.body;

  const response = await transactionService.createTransaction(id, service_code);

  return res.status(response.httpCode).json(response.body);
};
