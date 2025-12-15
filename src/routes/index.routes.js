const express = require("express");
const router = express.Router();

const authCtrl = require("../controllers/auth.controller");
const profileCtrl = require("../controllers/profile.controller");

const validate = require("../middlewares/validate.middleware");
const auth = require("../middlewares/auth.middleware");
const upload = require("../config/multer");
const schema = require("../validators/validator");
const { getBannerList } = require("../controllers/banner.controller");
const serviceCtrl = require("../controllers/service.controller");
const balanceCtrl = require("../controllers/balance.controller");
const topupCtrl = require("../controllers/topup.controller");
const transactionCtrl = require("../controllers/transaction.controller");
const historyCtrl = require("../controllers/history.controller");

// ---------- DEBUG (OPSIONAL) ----------
// console.log("typeof authCtrl.register:", typeof authCtrl.register);
// console.log("typeof authCtrl.login:", typeof authCtrl.login);
// console.log(
//   "typeof profileCtrl.updateProfile:",
//   typeof profileCtrl.updateProfile
// );
// ------------------------------------

// ---------- PUBLIC ----------
router.post("/registration", validate(schema.register), authCtrl.register);
router.post("/login", validate(schema.login), authCtrl.login);
router.get("/banner", getBannerList);

// ---------- PRIVATE ----------
router.get("/profile", auth, profileCtrl.getProfile);
router.get("/services", auth, serviceCtrl.getServiceList);
router.get("/balance", auth, balanceCtrl.getBalance);
// router.post("/topup", auth, validate(schema.topup), topupCtrl.topUpBalance);
router.post("/transaction", auth, transactionCtrl.transaction);
router.get("/transaction/history", auth, historyCtrl.getHistory);

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

module.exports = router;
