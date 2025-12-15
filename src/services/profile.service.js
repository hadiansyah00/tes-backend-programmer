const pool = require("../config/db");
const { success, error } = require("../utils/response");

/**
 * GET PROFILE USER
 */
exports.getProfile = async (email) => {
  try {
    const query = `
      SELECT email, first_name, last_name, profile_image
      FROM users
      WHERE email = $1
    `;
    const result = await pool.query(query, [email]);

    if (result.rows.length === 0) {
      return error(404, "User tidak ditemukan");
    }

    return success("Success", result.rows[0]);
  } catch (err) {
    console.error(err);
    return error(500, "Terjadi kesalahan server");
  }
};

/**
 * UPDATE PROFILE USER
 */
exports.updateProfile = async (email, first_name, last_name) => {
  try {
    const query = `
      UPDATE users
      SET first_name = $1,
          last_name = $2,
          updated_at = NOW()
      WHERE email = $3
      RETURNING email, first_name, last_name, profile_image
    `;
    const params = [first_name, last_name, email];
    const result = await pool.query(query, params);

    if (result.rows.length === 0) {
      return error(404, "User tidak ditemukan");
    }

    return success("Update Profile Success", result.rows[0]);
  } catch (err) {
    console.error(err);
    return error(500, "Terjadi kesalahan server");
  }
};

/**
 * UPDATE PROFILE IMAGE USER
 */
exports.updateProfileImage = async (email, imageUrl) => {
  try {
    const query = `
      UPDATE users
      SET profile_image = $1,
          updated_at = NOW()
      WHERE email = $2
      RETURNING email, first_name, last_name, profile_image
    `;
    const params = [imageUrl, email];
    const result = await pool.query(query, params);

    if (result.rows.length === 0) {
      return error(404, "User tidak ditemukan");
    }

    return success("Update Profile Image Success", result.rows[0]);
  } catch (err) {
    console.error(err);
    return error(500, "Terjadi kesalahan server");
  }
};
