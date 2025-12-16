const historyService = require("../services/history.service");
/**
 * GET TRANSACTION HISTORY
 */
exports.getHistory = async (req, res) => {
  try {
    const { id } = req.user;
    const offset = Number(req.query.offset) || 0;
    const limit = Number(req.query.limit) || 10;

    if (!id) {
      return res.status(401).json({
        status: 108,
        message: "Unauthorized",
        data: null,
      });
    }
    // Fetch history records
    const records = await historyService.getHistory(id, offset, limit);

    return res.json({
      status: 0,
      message: "Get Transaksi History Berhasil",
      data: {
        offset,
        limit,
        records,
      },
    });
  } catch (err) {
    console.error("GET HISTORY ERROR:", err);
    return res.status(500).json({
      status: 99,
      message: "Internal Server Error",
      data: null,
    });
  }
};
