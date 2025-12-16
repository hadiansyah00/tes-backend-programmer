const topupService = require("../services/topup.service");

/**
 * TOP UP BALANCE
 */
exports.topUpBalance = async (req, res) => {
  try {
    const { id } = req.user;
    console.log("JWT ID:", req.user.id); // ⬅️ WAJIB DI SINI
    // ✅ ambil user_id dari JWT
    const { amount } = req.body;

    const response = await topupService.topup(id, amount);

    return res.status(response.httpCode).json(response.body);
  } catch (err) {
    console.error("TOPUP CONTROLLER ERROR:", err);

    return res.status(500).json({
      status: 99,
      message: "Internal Server Error",
      data: null,
    });
  }
};
