const transactionService = require("../services/transaction.service");

/**
 * PAYMENT TRANSACTION
 */
exports.transaction = async (req, res) => {
  const { email } = req.user;
  const { service_code } = req.body;

  const response = await transactionService.createTransaction(
    email,
    service_code
  );

  return res.status(response.httpCode).json(response.body);
};
