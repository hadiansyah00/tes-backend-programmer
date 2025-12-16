const { pool } = require("../config/db");

/**
 * GET PROFILE BY USER ID
 */
exports.getProfileById = async (userId) => {
  const query = `
    SELECT 
      email,
      first_name,
      last_name,
      profile_image
    FROM users
    WHERE id = $1
  `;

  const result = await pool.query(query, [userId]);
  return result.rows[0];
};

/**
 * UPDATE PROFILE
 */
exports.updateProfileById = async (userId, firstName, lastName) => {
  const query = `
    UPDATE users
    SET first_name = $1,
        last_name = $2,
        updated_at = NOW()
    WHERE id = $3
    RETURNING email, first_name, last_name, profile_image
  `;

  const result = await pool.query(query, [firstName, lastName, userId]);

  return result.rows[0];
};

/**
 * UPDATE PROFILE IMAGE
 */
exports.updateProfileImageById = async (userId, imageUrl) => {
  const query = `
    UPDATE users
    SET profile_image = $1,
        updated_at = NOW()
    WHERE id = $2
  `;

  await pool.query(query, [imageUrl, userId]);
};
