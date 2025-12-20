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

    return {
      httpCode: 200,
      body: success(0, "Success", rows),
    };
  } catch (err) {
    console.error("[SERVICE_LIST_ERROR]", err);

    return {
      httpCode: 500,
      body: error(99, "Terjadi kesalahan server"),
    };
  }
};
