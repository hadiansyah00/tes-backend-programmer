const ProfileService = require("../services/profile.service");

/**
 * GET PROFILE
 */
exports.getProfile = async (req, res) => {
  try {
    if (!req.user || !req.user.id) {
      return res.status(401).json({
        status: 401,
        message: "Token tidak valid atau kadaluarsa",
        data: null,
      });
    }

    const { id } = req.user;

    const profile = await ProfileService.getProfileById(id);

    return res.status(200).json({
      status: 0,
      message: "Success",
      data: profile,
    });
  } catch (err) {
    console.error("[GET_PROFILE_ERROR]", err);

    return res.status(500).json({
      status: 500,
      message: "Terjadi kesalahan server",
      data: null,
    });
  }
};

/**
 * UPDATE PROFILE
 */
exports.updateProfile = async (req, res) => {
  try {
    if (!req.user || !req.user.id) {
      return res.status(401).json({
        status: 401,
        message: "Token tidak valid atau kadaluarsa",
        data: null,
      });
    }

    const { id } = req.user;
    const { first_name, last_name } = req.body;

    const profile = await ProfileService.updateProfileById(
      id,
      first_name,
      last_name
    );

    return res.status(200).json({
      status: 0,
      message: "Update Profile Success",
      data: profile,
    });
  } catch (err) {
    console.error("[UPDATE_PROFILE_ERROR]", err);

    return res.status(500).json({
      status: 500,
      message: "Terjadi kesalahan server",
      data: null,
    });
  }
};

/**
 * UPDATE PROFILE IMAGE
 */
exports.updateProfileImage = async (req, res) => {
  try {
    if (!req.user || !req.user.id) {
      return res.status(401).json({
        status: 401,
        message: "Token tidak valid atau kadaluarsa",
        data: null,
      });
    }

    if (!req.file) {
      return res.status(400).json({
        status: 400,
        message: "File tidak ditemukan",
        data: null,
      });
    }

    const { id } = req.user;

    const imageUrl = `${req.protocol}://${req.get("host")}/uploads/profile/${
      req.file.filename
    }`;

    await ProfileService.updateProfileImageById(id, imageUrl);

    return res.status(200).json({
      status: 0,
      message: "Update Profile Image Success",
      data: {
        profile_image: imageUrl,
      },
    });
  } catch (err) {
    console.error("[UPDATE_PROFILE_IMAGE_ERROR]", err);

    return res.status(500).json({
      status: 500,
      message: "Terjadi kesalahan server",
      data: null,
    });
  }
};
