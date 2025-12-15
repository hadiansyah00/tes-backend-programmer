const ProfileService = require("../services/profile.service");

exports.getProfile = async (req, res) => {
  const profile = await ProfileService.getProfile(req.user.email);

  return res.json({
    status: 0,
    message: "Success",
    data: profile,
  });
};

exports.updateProfile = async (req, res) => {
  const { first_name, last_name } = req.body;

  const profile = await ProfileService.updateProfile(
    req.user.email,
    first_name,
    last_name
  );

  return res.json({
    status: 0,
    message: "Update Profile Success",
    data: profile,
  });
};

exports.updateProfileImage = async (req, res) => {
  const imageUrl = `${req.protocol}://${req.get("host")}/uploads/profile/${
    req.file.filename
  }`;

  await ProfileService.updateProfileImage(req.user.email, imageUrl);

  return res.json({
    status: 0,
    message: "Update Profile Image Success",
    data: {
      profile_image: imageUrl,
    },
  });
};
