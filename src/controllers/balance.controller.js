const balanceService = require("../services/balance.service");

exports.getBalance = async (req, res) => {
  const { email } = req.user;

  const response = await balanceService.getBalance(email);

  return res.status(response.httpCode).json(response.body);
};
