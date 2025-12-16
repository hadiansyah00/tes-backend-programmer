const registerService = require("../services/register.service");

/**
 * Register user
 */
exports.register = async (req, res) => {
  try {
    const response = await registerService.register(req.body);

    if (!response || typeof response.httpCode !== "number") {
      console.error("INVALID REGISTER RESPONSE:", response);
      return res.status(500).json({
        status: 500,
        message: "Response service tidak valid",
        data: null,
      });
    }

    return res.status(response.httpCode).json(response.body);
  } catch (err) {
    console.error("[REGISTER_CONTROLLER_ERROR]", err);
    return res.status(500).json({
      status: 500,
      message: "Terjadi kesalahan server",
      data: null,
    });
  }
};
