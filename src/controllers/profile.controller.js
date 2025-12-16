const ProfileService = require("../services/profile.service");

exports.getProfile = async (req, res) => {
  console.log("=== GET PROFILE ===");
  console.log("req.user:", req.user);

  const { id } = req.user || {};

  console.log("JWT user id:", id);

  if (!id) {
    console.error("ERROR: User ID tidak ada di JWT");
    return res.status(401).json({
      status: 108,
      message: "Unauthorized - User ID not found",
      data: null,
    });
  }

  try {
    const profile = await ProfileService.getProfileById(id);

    console.log("Profile result:", profile);

    return res.json({
      status: 0,
      message: "Success",
      data: profile,
    });
  } catch (err) {
    console.error("GET PROFILE ERROR:", err);

    return res.status(500).json({
      status: 99,
      message: "Internal Server Error",
      data: null,
    });
  }
};

exports.updateProfile = async (req, res) => {
  console.log("=== UPDATE PROFILE ===");
  console.log("req.user:", req.user);
  console.log("req.body:", req.body);

  const { id } = req.user || {};
  const { first_name, last_name } = req.body;

  if (!id) {
    console.error("ERROR: User ID tidak ada di JWT");
    return res.status(401).json({
      status: 108,
      message: "Unauthorized",
      data: null,
    });
  }

  try {
    const profile = await ProfileService.updateProfileById(
      id,
      first_name,
      last_name
    );

    console.log("Updated profile:", profile);

    return res.json({
      status: 0,
      message: "Update Profile Success",
      data: profile,
    });
  } catch (err) {
    console.error("UPDATE PROFILE ERROR:", err);

    return res.status(500).json({
      status: 99,
      message: "Internal Server Error",
      data: null,
    });
  }
};

exports.updateProfileImage = async (req, res) => {
  console.log("=== UPDATE PROFILE IMAGE ===");
  console.log("req.user:", req.user);
  console.log("req.file:", req.file);

  const { id } = req.user || {};

  if (!id) {
    console.error("ERROR: User ID tidak ada di JWT");
    return res.status(401).json({
      status: 108,
      message: "Unauthorized",
      data: null,
    });
  }

  if (!req.file) {
    return res.status(400).json({
      status: 102,
      message: "File tidak ditemukan",
      data: null,
    });
  }

  const imageUrl = `${req.protocol}://${req.get("host")}/uploads/profile/${
    req.file.filename
  }`;

  try {
    await ProfileService.updateProfileImageById(id, imageUrl);

    console.log("Profile image updated:", imageUrl);

    return res.json({
      status: 0,
      message: "Update Profile Image Success",
      data: {
        profile_image: imageUrl,
      },
    });
  } catch (err) {
    console.error("UPDATE PROFILE IMAGE ERROR:", err);

    return res.status(500).json({
      status: 99,
      message: "Internal Server Error",
      data: null,
    });
  }
};
