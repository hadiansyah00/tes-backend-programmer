const db = require("../config/db");
const { success, error } = require("../utils/response");

exports.getBannerList = async () => {
  try {
    const query = `
      SELECT 
        banner_name,
        banner_image,
        description
      FROM banners
      ORDER BY id ASC
    `;

    const { rows } = await db.query(query);

    return {
      httpCode: 200,
      body: success(0, "Success", rows),
    };
  } catch (err) {
    console.error("[BANNER_SERVICE_ERROR]", err);

    return {
      httpCode: 500,
      body: error(99, "Terjadi kesalahan server"),
    };
  }
};
