const historyService = require("../services/history.service");

/**
 * TRANSACTION HISTORY
 */
exports.getHistory = async (req, res) => {
  const { email } = req.user;
  const { limit } = req.query;

  const response = await historyService.getHistory(email, limit);

  return res.status(response.httpCode).json(response.body);
};
