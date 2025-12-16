const balanceService = require("../services/balance.service");

/**
 * GET USER BALANCE
 */
exports.getBalance = async (req, res) => {
  try {
    const { id } = req.user || {};

    if (!id) {
      return res.status(401).json({
        status: 108,
        message: "Token tidak valid atau kadaluarsa",
        data: null,
      });
    }

    const response = await balanceService.getBalanceByUserId(id);

    return res.status(response.httpCode).json(response.body);
  } catch (err) {
    console.error("GET BALANCE CONTROLLER ERROR:", err);

    return res.status(500).json({
      status: 99,
      message: "Internal Server Error",
      data: null,
    });
  }
};
