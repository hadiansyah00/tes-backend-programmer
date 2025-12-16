const bannerService = require("../services/banner.service");

/**
 * GET BANNER LIST
 */
exports.getBannerList = async (req, res) => {
  try {
    const response = await bannerService.getBannerList();

    // Safety net
    if (!response || typeof response.httpCode !== "number") {
      console.error("INVALID BANNER SERVICE RESPONSE:", response);
      return res.status(500).json({
        status: 500,
        message: "Response service tidak valid",
        data: null,
      });
    }

    return res.status(response.httpCode).json(response.body);
  } catch (err) {
    console.error("[BANNER_CONTROLLER_ERROR]", err);
    return res.status(500).json({
      status: 500,
      message: "Terjadi kesalahan server",
      data: null,
    });
  }
};
