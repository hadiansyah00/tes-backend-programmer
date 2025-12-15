// controllers/service.controller.js
const db = require("../config/db");

exports.getServiceList = async (req, res, next) => {
  try {
    const query = `
      SELECT 
        service_code,
        service_name,
        service_icon,
        service_tariff
      FROM services
      ORDER BY id ASC
    `;

    const { rows } = await db.query(query);

    return res.status(200).json({
      status: 0,
      message: "Sukses",
      data: rows,
    });
  } catch (error) {
    next(error);
  }
};
