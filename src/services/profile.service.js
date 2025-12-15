const db = require("../config/db");

exports.getProfile = async (email) => {
  const result = await db.query(
    `SELECT email, first_name, last_name, profile_image
     FROM users WHERE email = $1`,
    [email]
  );

  return result.rows[0];
};

exports.updateProfile = async (email, first_name, last_name) => {
  const result = await db.query(
    `UPDATE users
     SET first_name = $1, last_name = $2, updated_at = NOW()
     WHERE email = $3
     RETURNING email, first_name, last_name, profile_image`,
    [first_name, last_name, email]
  );

  return result.rows[0];
};

exports.updateProfileImage = async (email, imageUrl) => {
  await db.query(
    `UPDATE users
     SET profile_image = $1, updated_at = NOW()
     WHERE email = $2`,
    [imageUrl, email]
  );
};
