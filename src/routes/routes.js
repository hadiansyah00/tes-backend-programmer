const express = require("express");
const router = express.Router();

const ctrl = require("../controllers/auth.controller");
const validate = require("../middlewares/validate.middleware");
const auth = require("../middlewares/auth.middleware");
const upload = require("../config/multer");
const schema = require("../validators/validator");

/**
 * Public APIs
 */
router.post("/registration", validate(schema.register), ctrl.register);

router.post("/login", validate(schema.login), ctrl.login);

/**
 * Private APIs (JWT Required)
 */
router.get("/profile", auth, ctrl.getProfile);

router.put(
  "/profile",
  auth,
  validate(schema.updateProfile),
  ctrl.updateProfile
);

router.put(
  "/profile/image",
  auth,
  upload.single("profile_image"),
  ctrl.updateProfileImage
);

module.exports = router;
