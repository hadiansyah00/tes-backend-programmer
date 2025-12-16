const transactionService = require("../services/transaction.service");

/**
 * PAYMENT TRANSACTION
 */ exports.transaction = async (req, res) => {
  try {
    if (!req.user || !req.user.id) {
      return res.status(401).json({
        status: 99,
        message: "Token tidak valid atau kadaluarsa",
        data: null,
      });
    }

    const { id } = req.user;
    const { service_code } = req.body;

    const response = await transactionService.createTransaction(
      id,
      service_code
    );

    if (!response || typeof response.httpCode !== "number") {
      console.error("INVALID SERVICE RESPONSE:", response);
      return res.status(500).json({
        status: 99,
        message: "Response service tidak valid",
        data: null,
      });
    }

    return res.status(response.httpCode).json(response.body);
  } catch (err) {
    console.error("[TRANSACTION_CONTROLLER_ERROR]", err);
    return res.status(500).json({
      status: 99,
      message: "Terjadi kesalahan server",
      data: null,
    });
  }
};
