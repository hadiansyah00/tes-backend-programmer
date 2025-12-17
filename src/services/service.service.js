const db = require("../config/db");
const { success, error } = require("../utils/response");

exports.getServiceList = async () => {
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

    return success(200, "Success", rows);
  } catch (err) {
    console.error("[SERVICE_LIST_ERROR]", err);
    return error(500, "Terjadi kesalahan server");
  }
};
