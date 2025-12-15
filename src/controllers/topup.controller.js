const topupService = require("../services/topup.service");

/**
 * TOP UP BALANCE
 */
exports.topup = async (req, res) => {
  const { email } = req.user;
  const { amount } = req.body;

  const response = await topupService.topup(email, amount);

  return res.status(response.httpCode).json(response.body);
};
