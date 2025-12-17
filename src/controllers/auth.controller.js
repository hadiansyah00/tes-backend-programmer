const authService = require("../services/auth.service");

/**
 * Login user
 */
exports.login = async (req, res) => {
  try {
    const response = await authService.login(req.body);

    // Safety check
    if (!response || typeof response.httpCode !== "number") {
      console.error("INVALID LOGIN RESPONSE:", response);
      return res.status(500).json({
        status: 500,
        message: "Response service tidak valid",
        data: null,
      });
    }

    return res.status(response.httpCode).json(response.body);
  } catch (err) {
    console.error("[LOGIN_CONTROLLER_ERROR]", err);
    return res.status(500).json({
      status: 500,
      message: "Terjadi kesalahan server",
      data: null,
    });
  }
};
