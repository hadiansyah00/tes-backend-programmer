const db = require("../config/db");

exports.getBannerList = async (req, res, next) => {
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

    return res.status(200).json({
      status: 0,
      message: "Sukses",
      data: rows,
    });
  } catch (error) {
    next(error);
  }
};
