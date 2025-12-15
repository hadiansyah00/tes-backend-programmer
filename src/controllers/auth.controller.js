const service = require("../services/auth.service");

/**
 * Register user
 */
exports.register = async (req, res) => {
  try {
    const result = await service.register(req.body);
    return res.status(200).json(result);
  } catch (err) {
    console.error("Register Error:", err);

    return res.status(500).json({
      status: 500,
      message: err.message || "Terjadi kesalahan pada server",
      data: null,
    });
  }
};

/**
 * Login user
 */
exports.login = async (req, res) => {
  try {
    const result = await service.login(req.body);
    return res.status(200).json(result);
  } catch (err) {
    console.error("Login Error:", err);

    return res.status(500).json({
      status: 500,
      message: err.message || "Terjadi kesalahan pada server",
      data: null,
    });
  }
};

/**
 * Get profile (protected)
 */
exports.getProfile = async (req, res) => {
  try {
    if (!req.user) {
      return res.status(401).json({
        status: 108,
        message: "Token tidak valid atau kadaluarsa",
        data: null,
      });
    }

    const result = await service.profile(req.user);
    return res.status(200).json(result);
  } catch (err) {
    console.error("Get Profile Error:", err);

    return res.status(500).json({
      status: 500,
      message: err.message || "Terjadi kesalahan pada server",
      data: null,
    });
  }
};
