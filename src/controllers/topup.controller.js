const topupService = require("../services/topup.service");

/**
 * TOP UP BALANCE
 */
exports.topUpBalance = async (req, res) => {
  try {
    // 🔐 Auth guard (fallback safety)
    if (!req.user?.id) {
      return res.status(401).json({
        status: 108,
        message: "Token tidak valid atau kadaluarsa",
        data: null,
      });
    }

    const { id } = req.user;
    const { amount } = req.body;

    // 🧪 Optional validation (idealnya via Joi middleware)
    if (typeof amount !== "number" || amount <= 0) {
      return res.status(400).json({
        status: 102,
        message: "Parameter amount harus berupa angka dan lebih dari 0",
        data: null,
      });
    }

    const response = await topupService.topup(id, amount);

    // 🛡 Safety net
    if (!response || typeof response.httpCode !== "number") {
      console.error("[INVALID_TOPUP_SERVICE_RESPONSE]", response);
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
