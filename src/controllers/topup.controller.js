const topupService = require("../services/topup.service");

/**
 * TOP UP BALANCE
 */
exports.topUpBalance = async (req, res) => {
  try {
    // 🔐 Guard authentication
    if (!req.user || !req.user.id) {
      return res.status(401).json({
        status: 99,
        message: "Token tidak valid atau kadaluarsa",
        data: null,
      });
    }

    const { id } = req.user;
    const { amount } = req.body;

    const response = await topupService.topup(id, amount);

    // 🛡 Safety net
    if (!response || typeof response.httpCode !== "number") {
      console.error("INVALID TOPUP SERVICE RESPONSE:", response);
      return res.status(500).json({
        status: 99,
        message: "Response service tidak valid",
        data: null,
      });
    }

    return res.status(response.httpCode).json(response.body);
  } catch (err) {
    console.error("[TOPUP_CONTROLLER_ERROR]", err);
    return res.status(500).json({
      status: 99,
      message: "Terjadi kesalahan server",
      data: null,
    });
  }
};
