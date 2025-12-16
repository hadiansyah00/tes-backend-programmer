const express = require("express");
const router = express.Router();

// Controllers
const authCtrl = require("../controllers/auth.controller");
const registerCtrl = require("../controllers/register.controller");
const profileCtrl = require("../controllers/profile.controller");
const bannerCtrl = require("../controllers/banner.controller");
const serviceCtrl = require("../controllers/service.controller");
const balanceCtrl = require("../controllers/balance.controller");
const topupCtrl = require("../controllers/topup.controller");
const transactionCtrl = require("../controllers/transaction.controller");
const historyCtrl = require("../controllers/history.controller");

// Middlewares
const validate = require("../middlewares/validate.middleware");
const auth = require("../middlewares/auth.middleware");
const upload = require("../config/multer");

// Validators
const schema = require("../validators/validator");

/**
 * ======================
 * PUBLIC ROUTES
 * ======================
 */
router.post("/registration", validate(schema.register), registerCtrl.register);
router.post("/login", validate(schema.login), authCtrl.login);
router.get("/banner", bannerCtrl.getBannerList);

/**
 * ======================
 * PROTECTED ROUTES
 * ======================
 */
router.get("/services", auth, serviceCtrl.getServiceList); // ⬅️ public (recommended)
router.get("/profile", auth, profileCtrl.getProfile);
router.put(
  "/profile",
  auth,
  validate(schema.updateProfile),
  profileCtrl.updateProfile
);

router.put(
  "/profile/image",
  auth,
  upload.single("profile_image"),
  profileCtrl.updateProfileImage
);

router.get("/balance", auth, balanceCtrl.getBalance);
router.post("/topup", auth, validate(schema.topup), topupCtrl.topUpBalance);

router.post("/transaction", auth, transactionCtrl.transaction);
router.get("/transaction/history", auth, historyCtrl.getHistory);

module.exports = router;
