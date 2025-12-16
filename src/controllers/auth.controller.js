const authService = require("../services/auth.service");

/**
 * Login user
 */
exports.login = async (req, res) => {
  try {
    const response = await authService.login(req.body);

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

/**
 * Get profile (protected)
 */
exports.getProfile = async (req, res) => {
  try {
    if (!req.user || !req.user.id) {
      return res.status(401).json({
        status: 401,
        message: "Token tidak valid atau kadaluarsa",
        data: null,
      });
    }

    const response = await authService.profile(req.user);

    if (!response || typeof response.httpCode !== "number") {
      console.error("INVALID PROFILE RESPONSE:", response);
      return res.status(500).json({
        status: 500,
        message: "Response service tidak valid",
        data: null,
      });
    }

    return res.status(response.httpCode).json(response.body);
  } catch (err) {
    console.error("[GET_PROFILE_CONTROLLER_ERROR]", err);
    return res.status(500).json({
      status: 500,
      message: "Terjadi kesalahan server",
      data: null,
    });
  }
};
